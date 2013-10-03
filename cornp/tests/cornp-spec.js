CORNP.addCommand('hallo', function(d){report('data: '+ d.data); }, 'object', '/');
function initTests() {
// This script needs to be run only after the DOM is ready
describe("CORN-P Object tests", function(){
    it("Object exists", function(){
        expect(CORNP).toBeDefined();
    });

    var m;
    try {
        CORNP.addErrorListener('hallo');
    }
    catch(e) {
        m = e.message;
    }
    it('bad error handler', function(){
        expect(m).toBe('CORNP_NOT_A_FUNCTION'); 
    });
    
    CORNP.addErrorListener(function(e,h){
        m = e;
        console.log(window.location.href + ' CORNP: '+ m + ' from ' +h);
    });

    var el = document.getElementById('responder');
    try { 
        // the following won't work on the file protocol
        CORNP.connect(el, '/');
    }
    catch(e) {
        console.log(e.message);
    }
    
    console.log('send some data');
   
    try {
        CORNP.send('/', 'hello', {'data': 'foo bar'});
    }
    catch (e ) {
        console.log( e.message) ;
    }

    
    
});

}
