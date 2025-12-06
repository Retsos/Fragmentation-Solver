import { Fragment } from "./frag-calc";

interface ResultsTableProps {
    fragments: Fragment[];
}

export const ResultsTable = ({ fragments }: ResultsTableProps) => {
    return (
        // 1. ΠΡΟΣΘΗΚΗ: overflow-x-auto για να ενεργοποιηθεί το scrollbar
        <div className="w-full overflow-x-auto border-collapse font-mono text-green-700 pb-2">

            {/* 2. ΠΡΟΣΘΗΚΗ: min-w-[600px] για να αναγκάσουμε το scroll σε μικρά κινητά */}
            <table className="w-full min-w-[300px]">
                <thead>
                    <tr className="text-green-800 border-b border-green-900/20">
                        <th className="py-2 px-4 text-left font-bold opacity-70">#</th>
                        <th className="py-2 px-4 text-left font-bold opacity-70">
                            Length <span className="text-[10px] font-normal opacity-50">(Total)</span>
                        </th>
                        <th className="py-2 px-4 text-left font-bold opacity-70">ID</th>
                        <th className="py-2 px-4 text-left font-bold opacity-70">MF</th>
                        <th className="py-2 px-4 text-left font-bold opacity-70">
                            Offset <span className="text-[10px] font-normal opacity-50">(x8)</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fragments.map((frag) => (
                        <tr
                            key={frag.n}
                            className="hover:bg-green-900/5 transition-colors border-b border-green-900/10"
                        >
                            <td className="py-2 px-4 text-green-600 font-medium">{frag.n}</td>
                            <td className="py-2 px-4 text-green-500">{frag.length}</td>
                            <td className="py-2 px-4 opacity-30">{frag.id}</td>
                            <td
                                className={`py-2 px-4 ${frag.mf ? "text-yellow-600" : "text-green-800"
                                    }`}
                            >
                                {frag.mf}
                            </td>
                            <td className="py-2 px-4 text-green-500">{frag.offset}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};