namespace Media.db;


entity MediaFile {
    key id        : UUID;
     @Core.ContentDisposition.Type: 'inline'
        @Core.MediaType   : mediaType
        content   : LargeBinary;
       @Core.IsMediaType : true
        mediaType : String;
        fileName  : String;
        size          : Integer;   
        url       : String;     
};