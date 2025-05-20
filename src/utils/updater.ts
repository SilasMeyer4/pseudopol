import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ca } from "vuetify/locale";

export async function runUpdater() {



    try {
        const update = await check();
        if (update) {
            console.log(
                `found update ${update.version} from ${update.date} with notes ${update.body}`
            );

            let downloaded = 0 ;
            let contentLength: number | undefined = undefined;

            await update.downloadAndInstall((event) => {
                switch (event.event) {
                    case "Started":
                        contentLength = event.data.contentLength;
                        console.log(`started dowloading ${event.data.contentLength ?? "unknown"} bytes`);
                        break;
                    case "Progress":
                        downloaded += event.data.chunkLength;
                        console.log(`downloaded ${downloaded} from ${contentLength ?? "unknown"}`);
                        break;
                    case "Finished":
                        console.log("download finished");
                        break;
                }
            });

            console.log("update installed");
            await relaunch();
        }
     
    } catch (error) {
        console.error("Updated failed: ", error);
    }
}


export async function check_for_update(): Promise<boolean> {
    const update = await check();
    if (update) {
        console.log("current version is not up to date");
        return true;
    }
    console.log("current version is up to date");
    return false;
}