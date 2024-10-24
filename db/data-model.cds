namespace Media.db;


entity MediaFile {
    key id        : UUID;
        @Core.MediaType   : mediaType

        content   : LargeBinary;
    
       @assert : 'mediaType in ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"]'
        @Core.IsMediaType : true
        mediaType : String;
        fileName  : String;
          size          : Integer;   
        url       : String;
       
};