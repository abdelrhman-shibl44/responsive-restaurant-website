(function (global) {
    let ajaxUtils = {};
    function checkHttpRequest() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest()
        } else {
            global.alert("ajax is not supported!")
        }
    }
    ajaxUtils.sendGetHttpRequest = function (urlRequest, responseHandler, isJsonFile) {
        let request = checkHttpRequest()
        request.onreadystatechange = () => handleResponse(request, responseHandler, isJsonFile)
        request.open('GET', urlRequest, true);
        request.send(null);
    }
    function handleResponse(request, responseHandler, isJsonFile) {
        if ((request.readyState === 4) &&
            (request.status === 200)) {
            if (isJsonFile == undefined) {
                isJsonFile = true
            }
            if (isJsonFile === true) {
                responseHandler(JSON.parse(request.responseText))
            } else {
                responseHandler(request.responseText)
            }
        }
    }
    global.$ajaxUtils = ajaxUtils
})(window)