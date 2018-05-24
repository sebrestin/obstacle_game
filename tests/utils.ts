declare var karmaHTML:any;

export function sleep(ms) {
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
