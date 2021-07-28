import React, { useEffect, useState } from "react"
import "blip-toolkit/dist/blip-toolkit.css"
import { getApplication } from "./api/applicationService"
import { getContacts, addContactCollections, addContact } from "./api/serviceController"
import { withLoading } from "./api/commomService"
import { PageHeader } from "components/PageHeader"
import { CommonProvider } from "contexts/CommonContext"
import { PageTemplate } from "components/PageTemplate"
import { BlipTabs } from 'blip-toolkit'
import ContactTable from './broadcastComponents/ContactTable';
import ImportContact from './broadcastComponents/ImportContact';
import ContactForm from './broadcastComponents/ContactForm';
import Footer from './Footer';
import ReactGA from 'react-ga'

function App() {
    const [application, setApplication] = useState({});
    const [_contacts, setContacts] = useState({
        data: { total: 0, items: [] },
        filter: {},
        pagination: 0
    });

    const handleOnChangePagination = async (index) => {
        withLoading(async () => { setContacts({ ..._contacts, pagination: index, data: await getContacts(index, _contacts.filter) }); })
    };
    const handleApplyFilter = async (newFilter) => {
        withLoading(async () => {
            setContacts({ pagination: 0, data: await getContacts(0, newFilter), filter: newFilter })
            ReactGA.event({
                category: "Contact Plugin",
                action: `Apply Contact`,
                label: "Plugin",
              });
        });
    };

    const handleContactCollectionAdd =  (contacts) => {
        withLoading(async () => {
            addContactCollections(contacts);
            ReactGA.event({
                category: "Contact Plugin",
                action: `Add Contact - ${contacts.length}`,
                label: "Plugin",
              });
        });
    }
    const handleContactAdd =  (contact) => {
        withLoading(async () => {
            addContact(contact);
            ReactGA.event({
                category: "Contact Plugin",
                action: `Add Unique Contact`,
                label: "Plugin",
              });
        });
    }



    const fetchApi = async () => {
        setApplication(await getApplication())
        setContacts({ ..._contacts, data: (await getContacts(_contacts.pagination)) })
    }

    useEffect(() => {
        withLoading(async () => {
            new BlipTabs('tab-nav')
            await fetchApi()
        })
        ReactGA.initialize(process.env.REACT_APP_GA_KEY, { useExistingGa: true })
        ReactGA.ga('create', process.env.REACT_APP_GA_KEY, 'auto', {
          cookieFlags: 'SameSite=None; Secure',
        })
    }, [])

    const title = "Contact Plugin"

    return (
        <CommonProvider>
            <div id="main" className="App">
                <PageHeader title={title} />
                <PageTemplate title={title}>
                    <div id="tab-nav" className="bp-tabs-container">
                        <ul className="bp-tab-nav">
                            {/* Add contatcs */}
                            <li>
                                <a href="#add" data-ref="add">Add/Update Contacts</a>
                            </li>
                            <li>
                                <a href="#export" data-ref="export">Export Contacts</a>
                            </li>
                            <li>
                                <a href="#import" data-ref="import">Import Contacts</a>
                            </li>
                            <li>
                                <a href="#export-notifications" data-ref="export-notifications">Export Contacts to Send Notifications</a>
                            </li>
                        </ul>
                        <div className="bp-tab-content fl w-100" data-ref="add">
                            <ContactForm onAdd={handleContactAdd} />
                        </div>
                        <div className="bp-tab-content fl w-100" data-ref="export">
                            <ContactTable
                                total={_contacts.data.total}
                                data={_contacts.data.items}
                                onApplyFilter={handleApplyFilter}
                                pagination={_contacts.pagination}
                                onChangePagination={handleOnChangePagination}
                                fileName={application ? application.name : ""}
                                isSendNotification={false}
                            />
                        </div>

                        <div className="bp-tab-content fl w-100" data-ref="import">
                            <ImportContact onAdd={handleContactCollectionAdd} />
                        </div>
                        <div className="bp-tab-content fl w-100" data-ref="export-notifications">
                            <ContactTable
                                total={_contacts.data.total}
                                data={_contacts.data.items}
                                onApplyFilter={handleApplyFilter}
                                pagination={_contacts.pagination}
                                onChangePagination={handleOnChangePagination}
                                fileName={application ? application.name : ""}
                                isSendNotification={true}
                            />
                        </div>
                    </div>
                </PageTemplate>
                <Footer />
            </div>
        </CommonProvider >
    )
}

export default App