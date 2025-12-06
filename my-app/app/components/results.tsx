import { Fragment } from "./frag-calc";

interface ResultsTableProps {
    fragments: Fragment[];
}

export const ResultsTable = ({ fragments }: ResultsTableProps) => {
    return (
        <div className="w-full text-left border-collapse font-mono text-green-500">
            <table className="w-full">
                <thead>
                    <tr className="text-green-700 border-b border-green-900">
                        <th className="py-2 px-4 text-left font-bold">#</th>
                        <th className="py-2 px-4 text-left font-bold">
                            Length <span className="text-[10px] text-green-800 font-normal">(Total)</span>
                        </th>
                        <th className="py-2 px-4 text-left font-bold">ID</th>
                        <th className="py-2 px-4 text-left font-bold">
                            MF <span className="text-[10px] text-green-800 font-normal">(More Frag)</span>
                        </th>
                        <th className="py-2 px-4 text-left font-bold">
                            Offset <span className="text-[10px] text-green-800 font-normal">(x8 bytes)</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fragments.map((frag) => (
                        <tr
                            key={frag.n}
                            className="hover:bg-green-900/20 transition-colors border-b border-green-900/30"
                        >
                            <td className="py-2 px-4 text-green-300 font-medium">{frag.n}</td>
                            <td className="py-2 px-4 text-green-400">{frag.length}</td>
                            <td className="py-2 px-4 opacity-50">{frag.id}</td>
                            <td
                                className={`py-2 px-4 ${frag.mf ? "text-yellow-500" : "text-red-500"
                                    }`}
                            >
                                {frag.mf}
                            </td>
                            <td className="py-2 px-4 text-green-400">{frag.offset}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};