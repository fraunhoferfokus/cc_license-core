import { RequestContext } from "next/dist/server/base-server";
import { requireSession } from "./auth-mw/auth";
import Core from "./components/core";

export default function Bedarfsmeldung() {

    return (
        <Core>
            <div>
                <h1>Bedarfsmeldung</h1>
            </div>
        </Core>
    )
}

export async function getServerSideProps(context: RequestContext) {
    return requireSession(context).then((props) => {
        // fetch users with axios
        // axios.get('http://localhost:3000/api/users').then((res) => {
        //   console.log(res.data)
        // })
        return props

    })
}