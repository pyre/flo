import React from 'react'

const SvgInfo = props => (
    <svg
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="info_svg__feather info_svg__feather-info"
        {...props}
    >
        <circle cx={12} cy={12} r={10} />
        <path d="M12 16v-4M12 8h0" />
    </svg>
)

export default SvgInfo
