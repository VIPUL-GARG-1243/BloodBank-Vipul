import React from 'react'

function Spinner() {
  return (
    <div className='fixed inset-0 bg-black opacity-70 z-[9999] flex justify-center items-center'>
        <div className='border-solid border-4 border-white h-20 w-20 border-t-transparent rounded-full animate-spin'></div>
    </div>
  )
}

export default Spinner