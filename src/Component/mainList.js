import React from 'react';
import { useTOKENContext } from '../Context';
import { CALL_CONTACT_LIST } from '../Network';
import ContactList from './contactList';
import FilterBox from './filterBox';


function MainList() {
    const [contacts, setContactsData] = React.useState()
    const [contactsList, setContactsList] = React.useState([])
    const [pageCount, setPageCount] = React.useState(10)

    const {
        callAuthApi,
        data
    } = useTOKENContext();

    React.useEffect(() => {
        callAuthApi()
    }, []);

    React.useEffect(() => {
        callContactApi()
        window.localStorage.setItem("token", JSON.stringify(data))
    }, [data]);

    async function callContactApi(action, text,tempObj) {
        let token;
        let dataTemp;
        if (!data)
            token = JSON.parse(window.localStorage.getItem("token"));
        else
            token = data
        console.log("calling....")

        if (action) {
            setPageCount(pageCount + 10)
        }
        dataTemp = await CALL_CONTACT_LIST(token, pageCount, text,tempObj)
        if (dataTemp) {
            setContactsList(prevState => ([...prevState, ...dataTemp?.contacts]))
            setContactsData(dataTemp)
        }
    }

    return (<div className="main-list-container">
        <div className="main-child-list1-container">
            <FilterBox count={contacts?.totalCount} callContactApi={callContactApi}/>

        </div> <div className="main-child-list2-container">
            <ContactList data={contacts} contactList={contactsList} callContactApi={callContactApi} />

        </div>
    </div>
    )
}
export default MainList;