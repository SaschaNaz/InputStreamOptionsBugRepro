// Minimal template without WinJS
Windows.UI.WebUI.WebUIApplication.addEventListener("activated", ev => {
    if (ev.detail[0].kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
        startStreamReceiver();
    }
})

function startStreamReceiver() {
    let emptyContentCount = 0;
    getMSStream("http://127.0.0.1:8000").then(stream => consumeMSStream(stream, content => {
        if (content.length > 0) {
            lastContentView.textContent = content;
        }
        else {
            emptyContentCount++;
            emptyContentCountView.textContent = emptyContentCount;
        }
    }))
}

function getMSStream(endpoint) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 3) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                }
                else {
                    reject(xhr.status);
                }
            }
        }

        xhr.open("GET", endpoint);
        xhr.responseType = "ms-stream";

        xhr.send();
    })
}

function consumeMSStream(stream, callback) {
    const input = stream.msDetachStream();
    const reader = new Windows.Storage.Streams.DataReader(input);
    reader.inputStreamOptions = Windows.Storage.Streams.InputStreamOptions.partial;

    let step = () => {
        consumeString(8192).then(content => {
            callback(content);
            setTimeout(() => step());
        });
    }

    step();
    
    function consumeString(count) {
        return reader.loadAsync(count).then(() => reader.readString(reader.unconsumedBufferLength));
    }
}