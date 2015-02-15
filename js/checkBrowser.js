function checkBrowser() {
    try {
        var urlhash = window.location.hash;
        if (!urlhash.match("fromapp")) {
            if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i))) {
                return "appBrowser";
            }else 
                return "PCBrowser";
        }
    } catch(err) {
        return "err";
    }
}