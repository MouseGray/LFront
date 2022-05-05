export namespace network {
    const service_url = 'http://localhost:8000/service';

    export function post(method: string, data : any, ok_handler : Function, error_handler : Function)  {
        fetch(service_url, __post_request(method, data))
        .then(req => {
            if (req.ok) 
            {
                __parse_body(req.body).then(body => ok_handler(body));
            }
            else 
            {
                __parse_body(req.body).then(body => error_handler(body));
            }
        })
        .catch(() => {
            showErrorText
        });
    }

    function __post_request(method : string, data : any) : RequestInit {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: method,
                data: data
            }),
            credentials: "include"
        }
    }

    function __parse_body(body : ReadableStream<Uint8Array>) : Promise<any> {
        return new Promise((resolve) => {
            body.getReader().read().then(raw_data => {
                const decoder = new TextDecoder('windows-1251');
                resolve(JSON.parse(decoder.decode(raw_data.value)));
            })
            .catch(() => {
                resolve(undefined);
            });
        });
    }
}