import classNames from "@/utils/classNames";
import { motion } from "motion/react";

interface HeroTabProps {
    label: string;
    value: string;
    description: string;
    isActive: boolean;
    onClick: () => void;
}

const HeroTab = ({ label, description, isActive, onClick }: HeroTabProps) => {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={classNames(
                "flex flex-col items-center py-2 px-4 flex-1 max-w-[220px] rounded-[10px] border transition-colors text-start",
                isActive
                    ? "bg-[#171717] border-[#171717] text-white shadow-[0_8px_23.1px_rgba(23,23,23,0.2)] dark:border-white/10"
                    : "bg-white border-[#ebebeb] text-[#5c5c5c] hover:border-[#d9d9d9] dark:bg-[#262626] dark:border-[#383838] dark:text-[#b3b3b3] dark:hover:border-[#4a4a4a]",
            )}
            onClick={onClick}
        >
            <span
                className={classNames(
                    "col-p3 relative z-10",
                    isActive
                        ? "text-white"
                        : "text-[#171717] dark:text-[#f8f8f8]",
                )}
            >
                {label}
            </span>
            <span
                className={classNames(
                    "relative z-10 text-xs",
                    isActive ? "text-white/70" : "",
                )}
            >
                {description}
            </span>
        </motion.button>
    );
};

export default HeroTab;
