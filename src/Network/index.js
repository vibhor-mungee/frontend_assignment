import axios from "axios";
import { API_URL } from "../Utils/constants";

export const CALL_CONTACT_LIST = async (token, count, text,tempObj) => {
    console.log("tagObject",tempObj);
    const options = {
        method: 'GET',
        url: `${API_URL}contacts`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access_token}`,
            Prefer: 'code=200, dynamic=true',
        },
        params: {
            accountId: '["acc_85027830-0bdf-4155-b8_f6e8"]',
            returnTotalCount: 'true',
            count,
            q: text,
            maxMessagesRecv: tempObj?.maxMessagesRecv||null,
            maxMessagesSent: tempObj?.maxMessagesSent||null,
            minMessagesRecv: tempObj?.minMessagesRecv||null,
            minMessagesSent: tempObj?.minMessagesSent||null,
            notTags: JSON.stringify(tempObj?.notTags)||null,
            tags: JSON.stringify(tempObj?.tags)||null
        },

    };

    let response = await axios.request(options);
    if (response.data !== undefined) {
        return response.data
    }
    else return null;
}
export const GET_ALL_TAG = async (token) => {
    const options = {
        method: 'GET',
        url: `${API_URL}tags`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access_token}`,
            Prefer: 'code=200, dynamic=true',
        }
    };
    let response = await axios.request(options);
    if (response.data !== undefined) {
        return response.data
    }
    else return null;
}