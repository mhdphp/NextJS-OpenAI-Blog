
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const Logo = () => {
    return (
        <div  className="text-3xl text-center py-4 font-heading">
            <Link href="/">BlogStandard</Link>
            <FontAwesomeIcon icon={faBrain} className="text-2xl text-slate-400 px-2" />
        </div>
    );
}   