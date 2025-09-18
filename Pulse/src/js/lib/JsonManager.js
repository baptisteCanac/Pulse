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
            return [];
        }
    }

    async getSidebarOpened(){
        try {
            const response = await fetch(this.filePath);
            const data = await response.json();
            return data.sidebar_opened;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getLanguagesData(){
        try {
            const response = await fetch(this.filePath);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}