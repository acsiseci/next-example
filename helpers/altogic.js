import { createClient } from "altogic"; // TODO Kaldıralacak
import getConfig from 'next/config';

let envUrl = getConfig().publicRuntimeConfig.altogicUrl;
let clientKey = getConfig().publicRuntimeConfig.altogicClientKey;


const altogic = createClient(envUrl, clientKey);// TODO Kaldıralacak
//const altogic = null // TODO Sadece Build Alırken Hata Çıkmaması İçin Eklenecek
export default altogic;
