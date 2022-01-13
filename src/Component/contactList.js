import React from "react";
import { Button, FormControl } from "react-bootstrap";
import blank from '../blank.png';
import Checkbox from "./checkBox";

function ContactList(props) {
    const [isCheckAll, setIsCheckAll] = React.useState(false);
    const [isCheck, setIsCheck] = React.useState([]);
    const [groupData, setGroupData] = React.useState([]);

    // add loader reference
    const loader = React.useRef(null)

    React.useEffect(() => {
        if (props.contactList) {
            if (groupData)
                setGroupData([]);
            //group list into alphabetical order
            let group = props.contactList.sort((a, b) => a?.name?.localeCompare(b?.name))
                .reduce((r, e) => {
                    const key = e.name && e.name[0].toUpperCase();
                    if (!r[key]) r[key] = []
                    r[key].push(e);
                    return r;
                }, {});
            // sort again group list
            const sorted = {};
            Object.keys(group).sort().forEach(key => {
                sorted[key] = group[key];
            });
            setGroupData(sorted)
        }
    }, [props])

    React.useEffect(() => {
        //handle infinite scroll 
        var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        // initialize IntersectionObserver
        // and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current)
        }
    }, []);

    const handleObserver = (entities) => {
        // call api on bottom page reach
        const target = entities[0];
        if (target.isIntersecting) {
            props.callContactApi(true);
        }
    }

    function handleClick(e) {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };
    function handleSelectAll(e) {
        setIsCheckAll(!isCheckAll);
        setIsCheck(props.contactList.map(li => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    function renderSelectLayout() {
        // render select All layout 
        return (<div className="contact-list-selectall-container">
            <div className="contact-list-selectall-checked">
                <Checkbox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                />
                <label id="selectAll" for="selectAll"><span>Select All</span></label>

            </div>
            <div className="contact-list-selectall-action">
                <Button className="contact-list-button">Export All</Button>
            </div>

        </div>
        )
    }

    function renderList(list) {

        let tempListArr = []
        if (list?.length > 0) {
            // filter list based on name and phone number
            list.forEach((element, index) => {
                if (element.name && element.phoneNumber) {
                    tempListArr.push(
                        <div key={index} className="contact-list-container">
                            <div className="contact-list-checkbox">
                                <Checkbox
                                    key={element?.id}
                                    type="checkbox"
                                    id={element?.id}
                                    handleClick={handleClick}
                                    isChecked={isCheck.includes(element?.id)}
                                />
                                <label id={element?.id} for={element?.id}></label>
                            </div>
                            <div className="contact-list-img">
                                <div className="avatar-small">
                                    <img className="avatar-img rounded-circle" src={blank} />
                                </div>
                            </div>
                            <div className="contact-list-name"> <h3 align="left">{element?.name || "abc"} </h3>
                                <p align="left">{element?.phoneNumber || "1231231231"}</p></div>
                            <div className="contact-list-action">
                                <div className="circle"> + </div>
                            </div>

                        </div>
                    )
                }
            })
        }
        return tempListArr
    }
    function handleTextChange(e) {
        if (e.target.value) {
            props.callContactApi(false, e.target.value)
        }
    }
    return (
        <div className="contact-list-main-container">
            <div className="contact-list-layout">
                <h3 style={{ display: 'flex', align: "left", width: '90%' }}>{`All Contacts (${props.data?.totalCount})`}</h3>
                <div className="circle"> + </div>
            </div>

            <FormControl
                type="text"
                placeholder="Search contacts"
                className="contact-list-search"
                onChange={handleTextChange}
            />
            {renderSelectLayout()}
            {Object.entries(groupData)
                .map(([key, value], i) => {
                    if (key === "null")
                        return null;
                    else {
                        return <div key={i}>
                            <strong className="contact-list-container text-size">{key.toUpperCase()}</strong>
                            {renderList(value)}
                        </div>
                    }
                })}
            <div className="loading" ref={loader}>
                <h2>Loading Data....</h2>
            </div>
        </div>)


}
export default ContactList;