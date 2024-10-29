
const { Readable, PassThrough } = require("stream");
const cds = require('@sap/cds');
cds.env.features.fetch_csrf = true

module.exports = cds.service.impl(async function () {

    const {
        MediaFile
    } = this.entities;


   
// this.on('CREATE',MediaFile,async (req) =>{
//     console.log(req.data);
//     const {id,content,mediaType,fileName,url} =req.data;
//      const newAsset={
//         id,
//         content,
//         mediaType,
//         fileName,
//         url
//      }
//     const result = await cds.tx(req).run(INSERT.into(MediaFile).entries(newAsset));

//         // Return the created asset
//         return result[0];
// });

// this.on('PUT', MediaFile, async (req) => {
//     console.log("put");
//     const mediaId = req.params.mediaId;
//     const content = req.rawBody; // Get binary content from the request

//     try {
//         await srv.transaction(req).update(MediaFile, mediaId, { content });
//         req.reply(); // No content to return
//     } catch (error) {
//         req.error(500, `Error updating media content: ${error.message}`);
//     }
// });
    /**
     * Handler method called on reading data entry
     * for entity Mediafile.
     **/
    // this.on("READ", MediaFile, async (req, next) => {
    //     if (!req.data.id) {
    //         return next();
    //     }
    //     //Fetch the url from where the req is triggered
    //     const url = req._.req.path;
    //     //If the request url contains keyword "content"
    //     // then read the media content
    //     if (url.includes("content")) {
    //         const id = req.data.id;
    //         var tx = cds.transaction(req);
    //         // Fetch the media obj from database
    //         var mediaObj = await tx.run(
    //             SELECT.one.from("Media.db.MediaFile", ["content", "mediaType"]).where(
    //                 "id =",
    //                 id
    //             )
    //         );
    //         if (mediaObj.length <= 0) {
    //             req.reject(404, "Media not found for the ID");
    //             return;
    //         }
    //         var decodedMedia = "";
    //         decodedMedia = new Buffer.from(
    //             mediaObj.content.toString().split(";base64,").pop(),
    //             "base64"
    //         );
    //         return _formatResult(decodedMedia, mediaObj.mediaType);
    //     } else return next();
    // });
    this.before('CREATE', 'MediaFile', async (req) => {

        req.data.url = `/media/MediaFile(${req.data.id})/content`;

       
    });

    // function _formatResult(decodedMedia, mediaType) {
    //     const readable = new Readable();
    //     const result1 = new Array();
    //     readable.push(decodedMedia);
    //     readable.push(null);
    //     return {
    //         value: readable,
    //         '*@odata.mediaContentType': mediaType
    //     }
    // };
})


// const SequenceHelper = require("./library/SequenceHelper");
// const { Readable } = require("stream");
// const cds = require('@sap/cds');
// cds.env.features.fetch_csrf = true;

// module.exports = cds.service.impl(async function () {

//     const { MediaFile } = this.entities;

//     /**
//      * Handler method called before creating data entry
//      * for entity MediaFile.
//      */
//     this.before('CREATE', MediaFile, async (req) => {
//         const db = await cds.connect.to("db");
//         // Create instance of SequenceHelper
//         const SeqReq = new SequenceHelper({
//             sequence: "MEDIA_ID",
//             db: db,
//         });

//         // Call method getNextNumber() to fetch the next sequence number 
//         const seq_no = await SeqReq.getNextNumber();
//         // Assign the sequence number to id element
//         req.data.id = seq_no;
//         // Assign the URL by appending the id
//         req.data.url = `/media/MediaFile(${req.data.id})/content`;
//     });

//     /**
//      * Handler method called on reading data entry
//      * for entity MediaFile.
//      **/
//     this.on("READ", MediaFile, async (req, next) => {
//         if (!req.data.id) {
//             return next();
//         }

//         // Fetch the URL from where the req is triggered
//         const url = req._.req.path;
//         // If the request URL contains keyword "content", read the media content
//         if (url.includes("content")) {
//             const id = req.data.id;
//             const tx = cds.transaction(req);
//             // Fetch the media object from the database
//             const mediaObj = await tx.run(
//                 SELECT.one.from("Media.db.MediaFile", ["content", "mediaType"]).where("id =", id)
//             );

//             // Check if media object was found
//             if (!mediaObj) {
//                 req.reject(404, "Media not found for the ID");
//                 return;
//             }

//             const decodedMedia = Buffer.from(mediaObj.content.toString().split(";base64,").pop(), "base64");
//             return _formatResult(decodedMedia, mediaObj.mediaType);
//         } else {
//             return next();
//         }
//     });

//     function _formatResult(decodedMedia, mediaType) {
//         const readable = new Readable();
//         readable.push(decodedMedia);
//         readable.push(null);
//         return {
//             value: readable,
//             '*@odata.mediaContentType': mediaType
//         };
//     }
// });
// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function () {
//     const { MediaFile } = this.entities;

//     this.on('CREATE', MediaFile, async (req) => {
//         const { id, mediaType, content, fileName, url } = req.data;
        

//         await INSERT.into(MediaFile).entries({ id, mediaType, content, fileName , url});
//         req.data.id = id; // Assign the new ID to the response
//     });
// });