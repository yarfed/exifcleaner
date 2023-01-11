const SMTPServer = require('smtp-server').SMTPServer;
const sendmail = require('sendmail')({silent: true});
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const fsx = require('fs-extra')
rmdir = require('rimraf');
const path = require('path');
const rimraf = require('rimraf');
const dir = '/home/yarfed/test/data';
var filesReadyFlag = 0;
var a =null;
var b = null;
var adressTo=null;



//const files = get(req, "body.data.files");

//require('path').join('/', 'users', dir, 'notes.txt') //'/users/flavio/notes.txt'
let paths =[];
/*
deleteFolderRecursive = function(path) {
  var files = [];
  if( fs.existsSync(path) ) {
      files = fs.readdirSync(path);
      files.forEach(function(file,index){
          var curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
  }
};
*/
/*
sendmail({
  from: 'no-reply@jarda.ru',
  to: "tr202@yandex.ru",//session.envelope.mailFrom.address,
  subject: null,//parsed.subject,
  html: 'test',//parsed.messageId,

   attachments: paths.map((path)=>{
    return { path };
  })

}, function (err) {
rimraf.sync('/home/yarfed/test/data');
paths.length = 0;
  console.log(err && err.stack);
  //console.dir(reply);
});*/



rimraf.sync('/home/yarfed/test/data');

const server = new SMTPServer({

  /////////////////////////////////////////////////////////////////////////////////////////////////
  size: 21971520, // allow messages up to 1 kb
    /*onRcptTo(address, session, callback) {
      // do not accept messages larger than 100 bytes to specific recipients
      let expectedSize = Number(session.envelope.mailFrom.args.SIZE) || 0;
      if (address.address === "almost-full@example.com" && expectedSize > 100) {
        err = new Error("Insufficient channel storage: " + address.address);
        err.responseCode = 452;
        return callback(err);
      }
      callback();
    },*/
      onRcptTo(address, session, callback){
        adressTo = address.address;
        if(address.address == 'test@jarda.ru'){
          return callback(); // Accept the address
            //return callback(new Error('Only test@jarda.ru and test1@jarda.ru is allowed to receive mail'));
        } else if(address.address == 'test1@jarda.ru'){
          return callback(); // Accept the address
        } 
        return callback(new Error('Only test@jarda.ru and test1@jarda.ru is allowed to receive mail'));
        
      },



  //////////////////////////////////////////////////////////////////////////////////////////////////
    onData: (stream, session, callback) => {
      address = session.envelope.mailFrom.address;
      
      console.log('From ' + address + ' to ' + adressTo);
      //console.log('mail');
        simpleParser(stream, {}, (parserError, parsed) => {
          console.log('ParseErr '+parserError);
			if ((parsed.attachments.length>0)&&(!parserError)){
        try {
            fs.statSync('/home/yarfed/test/data');
            console.log('directory exists');
            }
            catch (dirNotExist) {
              
              fs.mkdirSync('/home/yarfed/test/data');
              //let paths =[];
            if (dirNotExist.code === 'ENOENT') {
            console.log('directory created ');
            }else{
              console.log(dirExist);
            }
          }

        var a  = parsed.attachments;
        a.forEach(function(entry) {
        
                  try {
                    
                      
                      var fullFileName = (require('path').join('/', entry.filename)).replace(/\s+/g,'');
                      fullFileName = (fullFileName).replace(/\(/g,'');
                      fullFileName = (fullFileName).replace(/\)/g,'');
                      console.log(fullFileName);
                      //var ff1 = ('/home/yarfed/test/data1'+fullFileName);
                      fullFileName = (dir + fullFileName);
                      //fullFileName = (fullFileName).replace('/[^ a-z\d]/ui', '',$str );
                      console.log(fullFileName);
                      paths.push(fullFileName);
                      fs.writeFileSync(fullFileName, entry.content);
                      
                      //fs.writeFileSync(ff1, entry.content);
                //const data = fs.writeFileSync('/Users/flavio/test.txt', content)
                      console.log ("write file " + fullFileName);
                      console.log(paths.length);
                      } catch (error) {
                        console.error(error);
                      }
    
            });
            /////////////////////////////////////////////////////////////////////////////////////
            paths.forEach(function(entry){
            var string = "sudo exiftool -overwrite_original -all:all= " + entry;
            console.log('ExifTool' +entry);
            require('child_process').execSync(
              string,
              {stdio: 'inherit'}
            );

            string = "sudo qpdf --pages " + entry +" 1-z -- --empty "+ entry+ "1.pdf";
            console.log('qpdf' + entry);
            require('child_process').execSync(
              string,
              {stdio: 'inherit'}
            );
            string = "sudo mv " + entry + "1.pdf " + entry;
            console.log('mv' +entry)
            require('child_process').execSync(
              string,
              {stdio: 'inherit'}
            );




            });
          
            /////////////////////////////////////////////////////////////////////////////////////
           //////////////////////////////////////////////////////////////////////////////////////// 
            var recip=null;
           if(adressTo == 'test@jarda.ru') {
             recip = 'aleksandra.volkovapost@gmail.com';
            }else{
              recip='tr202@ya.ru'
            }
            sendmail({
              from: 'no-reply@jarda.ru',
              to: recip,//session.envelope.mailFrom.address,
              subject: parsed.subject,
              html: parsed.messageId,
            
               attachments: paths.map((path)=>{
                return { path };
              })

          }, function (err) {
            rimraf.sync('/home/yarfed/test/data');
            paths.length = 0;
              console.log(err && err.stack);
              //console.dir(reply);
          });
          /////////////////////////////////////////////////////////////////////////////////////////////
          callback();


			}else{
        console.log(parserError);
      }
  
    });	
    
    },
    
	authOptional: true

});
server.listen(25);



/*
sendmail({
  message

}, function (err) {
rimraf.sync('/home/yarfed/test/data');
paths.length = 0;
  console.log(err && err.stack);
  //console.dir(reply);
});
*/