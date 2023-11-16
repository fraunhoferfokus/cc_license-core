import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import RootLayout from "./components/Rooutlayout";

// import './globals.css'
import dynamic from 'next/dynamic'


export default function Test() {
    return <RootLayout>
        hello world
    </RootLayout>


}
