const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const qstring = require('querystring');
const contentType = require('content-type');

const MIME_MAP = {
	'.ico' : 'image/x-icon',
	'.html': 'text/html',
	'.js'  : 'text/javascript',
	'.json': 'application/json',
	'.css' : 'text/css',
	'.png' : 'image/png',
	'.jpg' : 'image/jpeg',
	'.svg' : 'image/svg+xml',
	'.pdf' : 'application/pdf',
	'.txt' : 'text/plain',
	'.log' : 'text/plain'
};

let responseNormal = (response, body, type) => {
	response.setHeader('Content-type', (!type) ? 'text/plain' : type);
	response.end(body);
};

let responseError = (response, message, status) => {
	console.log(status, message);
	response.statusCode = status;
	response.setHeader('Content-type', 'text/plain');
	response.end(message);
};

let responseRedirect = (response, redirectTo) => {
	response.writeHead(302, { 'Location': (redirectTo) ? redirectTo : '/index.html' });
	response.end();
};

let serveFile = (pathname, encoding, succ, fail) => {
	let extn = path.parse(pathname).ext;
	let ctyp = 'text/plain';
	let subt = false;
	if (extn) {
		ctyp = MIME_MAP[extn] || 'text/plain';
		switch (extn) {
		case '.html':
		case '.js':
		case '.json':
		case '.css':
		case '.svg':
		case '.txt':
		case '.log':
			if (encoding == null) encoding = 'utf8'; // default encoding
			if (encoding == 'utf8') subt = true;
			break;
		}
	}

	fs.readFile(path.join('.', pathname), encoding, (error, data) => {
		if (error) {
			if (error.code === 'ENOENT') {
				fail(404, pathname);
			} else {
				throw error;
			}
		} else {
			if (subt) {
				succ(data.replace(/%%%nodeServer%%%/g, "localhost"), ctyp);
			} else {
				succ(data, ctyp);
			}
		}
	});
};

let countries = {};

let readSvgPath = (succ, fail) => {
	let html = '<!doctype html><html><head><meta charset="utf-8"><title>Map</title><body><svg viewBox="0 0 1227 628">';
	fs.readdir("./svg/", (err, dir) => {
		let count = 0;
		let files = dir.filter((item) => item.startsWith('path'));
		for (let i = 0; i < files.length; i ++) {
			fs.readFile(path.join('./svg/', files[i]), 'utf8', (error, data) => {
				const REGEX = /[\s\S]*([<]path id=\"([a-zA-Z.-]+?)\"[\s\S]+?[/][>])[\s\S]*/g;
				count ++;
				let mth = REGEX.exec(data);
				if (mth != null) {
					html += mth[1];

					let ids = mth[2].split(".");
					if (!countries[ids[0]]) countries[ids[0]] = [];
					countries[ids[0]].push(ids[1]);
				}
				if (count >= files.length) {
					console.log(JSON.stringify(countries));
					html += '</svg></body></html>';
					succ(html, 'text/html');
				}
			});
		}
	});
}

http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: Cross Site!
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); // TODO: Cross Site!
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); // TODO: Cross Site!
	req.on('error', err => responseError(res, err, 500));

	res.on('error', err => responseError(res, err, 500));

	let buff = '';
	req.on('data', (chunk) => {
			buff += chunk;
			if (buff.length > 1e6) req.connection.destroy(); // data larger than 1M
	}).on('end', () => {
		if (req.method == 'OPTIONS') {// TODO: Cross Site!
			responseNormal(res, '', 'text/plain');
			return;
		}

		let rqst = url.parse(req.url, true);
		if (!rqst.pathname) throw new Error('Invalid request');
		let pathname = rqst.pathname;

		switch (pathname) {
		case '/':
			readSvgPath(
				(ctnt, type) => {
					responseNormal(res, ctnt, type);
				},
				(stts, ctnt) => {
					responseError(res, ctnt, stts);
				});
			break;

		default:
			serveFile(pathname, null,
				(ctnt, type) => {
					responseNormal(res, ctnt, type);
				},
				(stts, ctnt) => {
					responseError(res, ctnt, stts);
				});
		}
	});
}).listen(8080);