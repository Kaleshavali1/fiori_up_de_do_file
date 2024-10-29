namespace Media.db;


entity MediaFile {
    key id        : UUID;
     @Core.ContentDisposition.Type: 'inline'
        @Core.MediaType   : mediaType
        content   : LargeBinary;   //binary content of the file
       @Core.IsMediaType : true
        mediaType : String;  //MIME type of the file
        fileName  : String;
        size          : Integer;   
        url       : String;     
};