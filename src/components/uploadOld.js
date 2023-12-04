import React, { useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSiteLanguageData, variableValidator } from "../commons";
import getBase64 from "../commons/getBase64";
import { FILE_UPLOAD_LOADING, UPLOAD_FILE_DATA } from "../store/actions/actionType";
import { UploadFile } from "../store/actions/Utility";
import PropTypes from "prop-types";
import { UploadProfileImage } from "../store/actions/Profile";
import { startLoading, stopLoading } from "../store/actions/loading";
import { errorNotification } from "../commons/notification";

const Upload = (props) => {
  // const [fileName , setFileName]= useState('')
  const { error_message } =
	getSiteLanguageData('components/upload');

  const fileUrl = useSelector((state) => {
    return state?.utility?.[UPLOAD_FILE_DATA]?.result || "";
  }, shallowEqual);
  const fileName = useSelector((state) => {
    return state?.utility?.[UPLOAD_FILE_DATA]?.name || "";
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (variableValidator(fileUrl)) {
      if (props.onFinish !== undefined) {
        dispatch(stopLoading(FILE_UPLOAD_LOADING));
        props.onFinish(fileUrl, fileName, props.fileType);
      }
    }
  }, [fileUrl]);
  const handleOnClick = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    // input.setAttribute('multiple', 'true');
    input.setAttribute("accept", "image/*");
    if (props.multiple) {
      input.setAttribute("multiple", 'true');
    }
    input.click();
    input.onchange = imageUpload;
  };

  const imageUpload = useCallback((e) => {
    let file = e.target.files[0];
    const fname = file.name
    const ext = fname.split('.').slice(-1).join('.');
    if (props.fileType === 'plan') {
      if (ext === "jpg" || ext === "pdf"|| ext === "png")
      {
        getBase64(file, (result) => {
              dispatch(
                UploadFile({
                  module_type: props?.fileType,
                  module_key: props?.fileKey,
                  file: result,
                  name: file?.name,
                })
              );
         })
      }
      else{
        errorNotification(error_message.text)
        return;
      }
    }
    else {
      if (file) {
        getBase64(file, (result) => {
          if (props.fileType === "profile") {
            dispatch(startLoading(FILE_UPLOAD_LOADING));
            dispatch(
              UploadProfileImage({
                user_id: props?.fileKey,
                file: result,
              })
            );
          } else {
            // setFileName(file?.name)
            dispatch(
              UploadFile({
                module_type: props?.fileType,
                module_key: props?.fileKey,
                file: result,
                name: file?.name,
              })
            );
          }
        });
      }
    }
  });

  // const imageUpload = useCallback((e) => {
  //   let file = e.target.files[0];
  //   if (file) {
  //     getBase64(file, (result) => {
  //       if (props.fileType === "profile") {
  //         dispatch(startLoading(FILE_UPLOAD_LOADING));
  //         dispatch(
  //           UploadProfileImage({
  //             user_id: props?.fileKey,
  //             file: result,
  //           })
  //         );
  //       } else {
  //         // setFileName(file?.name)
  //         dispatch(
  //           UploadFile({
  //             module_type: props?.fileType,
  //             module_key: props?.fileKey,
  //             file: result,
  //             name: file?.name,
  //           })
  //         );
  //       }
  //     });
  //   }
  // });
  // const imageUploadMultipart = useCallback((e) => {
  //   let file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('file',e.target.files)
  //   formData.append('module_type',props?.fileType)
  //   formData.append('module_key',props?.fileKey)
  //   // formData.append('file',file)
  //   // {
  //   //   : ,
  //   //   : ,
  //   //   file: ,
  //   //   name: file?.name,
  //   // }
  //   dispatch(
  //     UploadFile(formData)
  //   );
  //   // if (file) {
  //   //   getBase64(file, (result) => {
  //   //     if (props.fileType === "profile") {
  //   //       dispatch(startLoading(FILE_UPLOAD_LOADING));
  //   //       dispatch(
  //   //         UploadProfileImage({
  //   //           user_id: props?.fileKey,
  //   //           file: result,
  //   //         })
  //   //       );
  //   //     } else {
  //   //       // setFileName(file?.name)
  //   //       dispatch(
  //   //         UploadFile({
  //   //           module_type: props?.fileType,
  //   //           module_key: props?.fileKey,
  //   //           file: result,
  //   //           name: file?.name,
  //   //         })
  //   //       );
  //   //     }
  //   //   });
  //   // }
  // });


  // const imageUploadMultiple = useCallback((e) => {
  //   // let file = e.target.files[0];
  //   let files = e.target.files;
  //   var that = this;
  //   // if (file) {
  //   if (files && files.length > 0) {
  //     async function promiseS3Quill() {

  //       // var user_uploaded_imagearray = that.state.user_uploaded_image || [];
  //       let promiseArr = [];
  //       // var img_in_message = '';
  //       for (const file of files) {
  //         let file_name = file.name;

  //         let data = new Promise((resolve, reject) => {
  //           setTimeout(() => {
  //             if (file !== undefined) {
  //               let sizeLimit = file.size / 1024 / 1024 < 30
  //               if (sizeLimit) {
  //                 let reader = new FileReader();
  //                 reader.onload = async function (readerEvt) {
  //                   var binaryString = await readerEvt.target.result;
  //                   var binary = await btoa(binaryString);

  //                   var post = {
  //                     image_url: binary,
  //                     type: file.type,
  //                     file_name: file_name
  //                   };

  //                   resolve(post)
  //                 }
  //                 reader.readAsBinaryString(file);
  //               } else {
  //                 // message.error(
  //                 //   "Maximum file upload size is 30MB"
  //                 // );
  //               }
  //             }
  //           }, 10)
  //         })
  //         promiseArr.push(data)
  //       }

  //       let allLogs = await Promise.all(promiseArr).then(d => {
  //         return d
  //       })
  //       // that.props.dispatch(UploadFile({
  //       //   module_type: props?.fileType,
  //       //   module_key: props?.fileKey,
  //       //   file: result,
  //       //   name: file?.name,
  //       // }));
  //     }
  //     // getBase64(file, (result) => {
  //     //   if (props.fileType === "profile") {
  //     //     dispatch(startLoading(FILE_UPLOAD_LOADING));
  //     //     dispatch(
  //     //       UploadProfileImage({
  //     //         user_id: props?.fileKey,
  //     //         file: result,
  //     //       })
  //     //     );
  //     //   } else {
  //     //     // setFileName(file?.name)
  //     //     dispatch(
  //     //       UploadFile({
  //     //         module_type: props?.fileType,
  //     //         module_key: props?.fileKey,
  //     //         file: result,
  //     //         name: file?.name,
  //     //       })
  //     //     );
  //     //   }
  //     // });
  //   }
  // });

  return (
    // <div id="event_banner" className="fancy_file_upload">
    // 	<input type="file" name="" onChange={imageUpload} />
    // </div>
    // props?.children
    React.cloneElement(props.children, { onClick: handleOnClick })
  );
};

Upload.propTypes = {
  fileType: PropTypes.string.isRequired,
  fileKey: PropTypes.string.isRequired,
};

export default Upload;
