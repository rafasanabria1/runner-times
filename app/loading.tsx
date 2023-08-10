import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Loading () {
  return (
    <div className='flex-grow grid place-content-center'>
      <FontAwesomeIcon icon={faSpinner} spin className="w-12 h-12 text-darker" />
    </div>
  )
}
