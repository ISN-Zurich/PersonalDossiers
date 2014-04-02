var ISNResizer; 
if (typeof ISNResizer === "undefined") { 
    ISNResizer = function(m) { 
        var d, i, k, ae, el, s, so = {}, sl, oi; 
        try {
            d=JSON.parse(m.data);
        } 
        catch(e) { 
            d = {}; 
        } 
        if ( d.isnpdid && d.height >= 0 ) { 
            var k,ae = document.getElementsByTagName('iframe'); 
            for (k=0; k < ae.length; k++) { 
                el = ae[k]; 
                if ( d.self === el.getAttribute("src") ) { 
                    s = el.getAttribute("style"), so = {}; 
                    if ( s && s.length ) { 
                        sl=s.split(";"); 
                        for (i = 0; i < sl.length; i++) { 
                            oi = sl[i].split(":"); 
                            so[oi[0]] = oi[1];
                        }
                    } 
                    so.height = d.height + "px"; 
                    s = ""; 
                    for ( k in so ) { 
                        s = s + k + ":" + so[k] + ";"; 
                    } 
                    el.setAttribute("style", s); 
                }
            }
        }
    }; 
    window.addEventListener("message", ISNResizer, false); 
}

function loadScriptID() {
    var scripts = document.getElementsByTagName('script');
    var sTag = scripts[scripts.length - 1];
    var scriptURL = sTag.src;
    var aTag = document.createElement('a');
    aTag.href = scriptURL;

    var dossierid, 
        embType,
        query = aTag.search.slice(1).split('&'); // load the query parameters
    for (var i = 0; i < query.length; i++) {
        var aParam = query[i].split('=');
        switch(aParam[0]) {
        case 'id':
            dossierid = aParam[1];     
            break;
        case 'type':
            embType = aParam[1];
            break;
        default:
            break;
        }
    }
    
    var iTag = document.createElement('iframe');
    iTag.src = 'http://lab.isn.ethz.ch/embed' + embType + '.html?id=' + dossierid;
    iTag.setAttribute('style', "width: 100%; height: 900px; border: none; overflow: hidden;");
    iTag.setAttribute('frameborder', '0');
    iTag.setAttribute('scrolling', 'no');
    if (sTag.nextSibling) {
        sTag.parentElement.insertBefore(iTag, sTag.nextSibling);
    }
    else {
        sTag.parentElement.appendChild(iTag);
    }
}

loadScriptID();