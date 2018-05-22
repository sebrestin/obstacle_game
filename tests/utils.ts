declare var karmaHTML:any;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function wait(done) {
    sleep(100).then(
        ()=> {
            if (karmaHTML.index.ready) {
                done();
            } else {
                wait(done);
            }
        }
    );
}