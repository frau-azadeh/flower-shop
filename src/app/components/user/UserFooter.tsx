import React from 'react'

const UserFooter:React.FC = () => {
  return (
<footer className="border-t border-border bg-surface flex flex-col justify-center items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center text-xs text-text/70">
        <span>
          تمامی حقوق این وب سایت متعلق به{" "}
          <a
            href="https://sunflower-dev.com"
            className="text-primary font-bold"
          >
            آزاده شریفی سلطانی{" "}
          </a>
          می باشد{" "}
        </span>
      </div>
    </footer> 
)
}

export default UserFooter