import Image from "next/image"
import Link from "next/link"

import error_thumb from "@/assets/imgs/resources/error.png"

const ErrorArea = () => {
   return (
      <section className="error-page section-space text-center">
         <div className="small-container">
            <div className="row">
               <div className="col-xxl-12">
                  <figure className="w-img">
                     <Image src={error_thumb} alt="" />
                  </figure>
                  <h2 className="mt-50 mb-50">Whoops! This Page got <br />Lost in converstion</h2>
                  <div className="error-btn-box">
                     <Link className="primary-btn-1 btn-hover" href="/">
                        Go back to home &nbsp; | <i className="icon-right-arrow"></i>
                        <span style={{ top: "147.172px", left: "108.5px" }}></span>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default ErrorArea
