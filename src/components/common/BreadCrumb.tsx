import Link from "next/link";

interface DataType {
   sub_title: string;
   title: string;
}
const BreadCrumb = ({ sub_title, title }: DataType) => {
   return (
      <div className="breadcrumb__area theme-bg-1 p-relative pt-160 pb-160">
         <div className="breadcrumb__thumb" style={{ backgroundImage: `url(/assets/imgs/resources/page-title-bg-1.png)` }} ></div>
         <div className="breadcrumb__thumb_2" style={{ backgroundImage: `url(/assets/imgs/resources/page-title-bg-2.png)` }} ></div>
         <div className="breadcrumb__thumb_3" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-53.png)` }} ></div>
         <div className="small-container">
            <div className="row justify-content-center">
               <div className="col-xxl-12">
                  <div className="breadcrumb__wrapper p-relative">
                     <h2 className="breadcrumb__title">{sub_title}</h2>
                     <div className="breadcrumb__menu">
                        <nav>
                           <ul>
                              <li><span><Link href="/">Home</Link></span></li>
                              <li><span>{title}</span></li>
                           </ul>
                        </nav>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BreadCrumb
