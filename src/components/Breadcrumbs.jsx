import React from 'react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="text-gray-300">›</span>}
                        {item.href ? (
                            <a href={item.href} className="hover:text-primary transition-colors">
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-textMain font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
