
function ajax(mth, url, hdr, dat, back) {
	if ((mth != 'GET') && (mth != 'POST') && (mth != 'PUT') && (mth != 'DELETE')) {
		alert("Unsupported method " + mth);
		return;
	}

	if (mth == 'GET') {
		dat = null;
	} else if (typeof dat !== 'string') {
		dat = JSON.stringify(dat);
	}

	let x = new XMLHttpRequest();
    x.open(mth, url, true);
    for (let key in hdr) {
        let val = hdr[key];
        if ((typeof val !== "undefined") && (val !== "")) {
            x.setRequestHeader(key, val);
        }
    }

	if (mth != 'GET') x.setRequestHeader("Content-Type", "application/json");
	x.onreadystatechange = function() {
		if (x.readyState === 4) {
			if (x.status === 200) {
                back(x.getAllResponseHeaders(), x.responseText);
			}
		}
	};
	x.send(dat);
}

function parseResHeader(hdrs) {
    let lst = hdrs.trim().split(/[\r\n]+/);
    let rtn = {};
    for (let i = 0; i < lst.length; i ++) {
        let parts = lst[i].split(': ');
        if (parts.length === 2) {
            rtn[parts[0]] = parts[1];
        }
    }
    return rtn;
}