import Image from 'next/image'
import styles from '../styles/todo.module.css'




export default function Doc(props:any) {
  const { doc, onChange, onDelete } = props;
  return (
    <tr key={doc.id}>
       <td className="py-2 px-4 border-b text-center">
                <input
                  type="checkbox"
                  name="read"
                  checked={doc.read}
                  onChange={(e) => onChange(e, doc.id)}
                />
              </td>
      <td className="py-2 px-4 border-b">
      <input name="name" type="text"  value={doc.name} onChange={(e)=>onChange(e,doc.id)} 
        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />

      </td>
                   
              <td className="py-2 px-4 border-b text-center">
              <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-900 shadow-sm ring-1 ring-inset ring-red-300 hover:ring-red-400" onClick={() => onDelete(doc.id)}>Remove</button>
              </td>
            </tr>
  )
}