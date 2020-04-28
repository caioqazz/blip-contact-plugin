import { IframeMessageProxy } from 'iframe-message-proxy'
import { generateLineFilter, generateLinePagination } from '../util';
import { errorToast, successToast } from '../toastUtil';

const DEFAULT_DATA = { total: 0, items: [] };

export const getApplication = async () => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: 'getApplication',
    })
    return application
}
export const getContacts = async (pagination, filter) => {

    try {
        const { response } = await IframeMessageProxy.sendMessage({
            action: 'sendCommand',
            content: {
                destination: 'MessagingHubService',
                command: {
                    method: 'get',
                    uri: '/contacts' + generateLinePagination(pagination) + generateLineFilter(filter)
                }
            }
        })

        return response

    } catch (error) {
        errorToast("Error loading contacts")
        return DEFAULT_DATA;

    }

}

export const addContactCollections = async (contacts) => {
    let count = 0;
    for (const element of contacts) {
        count += await addContactBase(element);
    }
    successToast(`${count} contacts add`);
}

export const addContact = async (contact) => {
  console.log(contact);
  
    //     await addContactBase(contact);
  
    // successToast(`${contact.identity} contacts add`);
}

const addContactBase = async (contact) => {


    try {
        await IframeMessageProxy.sendMessage(
            {
                action: 'sendCommand',
                content: {
                    destination: 'MessagingHubService',
                    command: {
                        method: "set",
                        uri: "/contacts",
                        type: "application/vnd.lime.contact+json",
                        resource: contact


                    }
                }
            })


        return 1;

    } catch (error) {
        errorToast("Error adding contact"+ error)
        return;
    }
}

