import { createClient } from "altogic";
import getConfig from 'next/config';

let envUrl = getConfig().publicRuntimeConfig.altogicUrl;
let clientKey = getConfig().publicRuntimeConfig.altogicClientKey;


const altogic = createClient(envUrl, clientKey);
export default altogic;
