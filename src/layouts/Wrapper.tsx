"use client";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "@/components/common/ScrollToTop";

const Wrapper = ({ children }: { children: React.ReactNode }) => {

    return <>
        {children}
        <ScrollToTop />
        <ToastContainer position="top-center" />
    </>;
}

export default Wrapper
