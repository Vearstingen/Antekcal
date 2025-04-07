export const Card = ({ children }) => <div className="border rounded shadow">{children}</div>;
export const CardContent = ({ children, className }) => <div className={className}>{children}</div>;