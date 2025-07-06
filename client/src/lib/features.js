import moment from "moment";

const fileFormat = (url = "") => {
    const fileExtension = url.split(".").pop();

    if(fileExtension === "mp4" || fileExtension === "webm" || fileExtension === "ogg"){
        return "video";
    }

    if(fileExtension === "mp3" || fileExtension === "wav" ){
        return "audio";
    }

    if(fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif"){
        return "image";
    }

    return "file" ;
};

const transformImage = (url , width = 100) => {

    if (!url) return url;
    
    if (typeof url !== 'string') {
        console.warn('transformImage expects a string URL, got:', typeof url, url);
        return url;
    }
    
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return newUrl;

    // const newUrl = url.replace("upload/" , `upload/dpr_auto/w_${width}/`);

    // return newUrl ;
}


const getLast7days = () => {
    const currentDate = moment();
    const last7Days = [];

    for(let i = 0; i < 7; i++) {
        const dayDate = currentDate.clone().subtract(i, 'days');
        const dayName = dayDate.format('dddd');

        last7Days.unshift(dayName);
    }

    return last7Days;
};


const getOrSaveFromStorage = ({key , value , get}) => {
    if(get){
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null ;
    }else{
        localStorage.setItem(key , JSON.stringify(value));
    }
}

export {fileFormat , transformImage , getLast7days , getOrSaveFromStorage} ;