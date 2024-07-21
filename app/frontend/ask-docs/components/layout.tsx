//  import styles from '../styles/layout.module.css'

 export default function Layout(props:any) {
   return (
    <div className="lg:flex lg:items-center lg:justify-between m-10">
    <div className="min-w-0 flex-1">

    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Ask Docs</h2>
       {props.children}
     </div>
   </div>
   )
 }