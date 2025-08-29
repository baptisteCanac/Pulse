export default class JsonManager{
    constructor(filePath){
        this.filePath = filePath;
    }

    async getRecentFileTitles(){
        try {
            const response = await fetch(this.filePath);
            const data = await response.json();
            return data.recent_files_titles;
        } catch (error) {
            console.error(error);
            return []; // évite que ça casse
        }
    }
}