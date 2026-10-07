import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Mode } from '../types'
import {
    VscChevronRight,
    VscChevronDown,
    VscFolder,
    VscFolderOpened,
} from 'react-icons/vsc'
import { IoLogoReact } from 'react-icons/io5'
import classNames from '@/utils/classNames'

type LayoutFile = { name: string; lightImg: string; darkImg: string }
type FileFolder = { name: string; files: LayoutFile[] }

export default function VersatileLayoutShowcase({ mode }: { mode: Mode }) {
    const folders: FileFolder[] = [
        {
            name: 'layouts',
            files: [
                {
                    name: 'InsetShell.tsx',
                    lightImg: '/img/landing/layout-inset-shell-light.webp',
                    darkImg: '/img/landing/layout-inset-shell-dark.webp',
                },
                {
                    name: 'SeamlessSide.tsx',
                    lightImg: '/img/landing/layout-seamless-side-light.webp',
                    darkImg: '/img/landing/layout-seamless-side-dark.webp',
                },
                {
                    name: 'StackedSide.tsx',
                    lightImg: '/img/landing/layout-stacked-side-light.webp',
                    darkImg: '/img/landing/layout-stacked-side-dark.webp',
                },
                {
                    name: 'DuoTierHeader.tsx',
                    lightImg: '/img/landing/layout-duo-tier-header-light.webp',
                    darkImg: '/img/landing/layout-duo-tier-header-dark.webp',
                },
                {
                    name: 'TopBarClassic.tsx',
                    lightImg: '/img/landing/layout-top-bar-classic-light.webp',
                    darkImg: '/img/landing/layout-top-bar-classic-dark.webp',
                },
                {
                    name: 'Blank.tsx',
                    lightImg: '/img/landing/layout-blank-light.webp',
                    darkImg: '/img/landing/layout-blank-dark.webp',
                },
            ],
        },
    ]

    const [expandedFolders, setExpandedFolders] = useState<string[]>([
        'layouts',
    ])
    const [activeFile, setActiveFile] = useState<string>('InsetShell.tsx')

    const toggleFolder = (folderName: string) => {
        setExpandedFolders((prev) =>
            prev.includes(folderName)
                ? prev.filter((f) => f !== folderName)
                : [...prev, folderName],
        )
    }

    const currentFile =
        folders.flatMap((f) => f.files).find((f) => f.name === activeFile) ||
        folders[0].files[0]
    const displayImg =
        mode === 'light' ? currentFile.lightImg : currentFile.darkImg

    return (
        <motion.div
            key="versatile-layouts"
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="flex w-full h-full bg-white dark:bg-black rounded-lg overflow-hidden"
        >
            <div className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] overflow-y-auto p-2">
                <div className="py-2">
                    {folders.map((folder) => {
                        const isExpanded = expandedFolders.includes(folder.name)
                        return (
                            <div key={folder.name}>
                                <div
                                    className="flex items-center px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => toggleFolder(folder.name)}
                                >
                                    <span className="mr-1 flex items-center justify-center w-4 h-4">
                                        {isExpanded ? (
                                            <VscChevronDown />
                                        ) : (
                                            <VscChevronRight />
                                        )}
                                    </span>
                                    <span className="mr-2">
                                        {isExpanded ? (
                                            <VscFolderOpened />
                                        ) : (
                                            <VscFolder />
                                        )}
                                    </span>
                                    <span className="text-sm font-medium select-none">
                                        {folder.name}
                                    </span>
                                </div>
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col">
                                                {folder.files.map((file) => {
                                                    const isActive =
                                                        activeFile === file.name
                                                    return (
                                                        <div
                                                            key={file.name}
                                                            onClick={() =>
                                                                setActiveFile(
                                                                    file.name,
                                                                )
                                                            }
                                                            className={classNames(
                                                                'flex items-center pl-8 pr-2 py-1.5 cursor-pointer transition-colors rounded-lg',
                                                                isActive
                                                                    ? 'bg-gray-200/80 dark:bg-gray-800 text-gray-900 dark:text-white'
                                                                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50',
                                                            )}
                                                        >
                                                            <span className="mr-2 flex items-center justify-center">
                                                                <IoLogoReact
                                                                    className={classNames(
                                                                        'transition-colors',
                                                                        isActive
                                                                            ? 'text-primary'
                                                                            : '',
                                                                    )}
                                                                />
                                                            </span>
                                                            <span className="select-none">
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-[#111111] relative p-0 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeFile + mode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                    >
                        <img
                            className="w-full h-auto"
                            src={displayImg}
                            alt={`Eyris ${activeFile} homepage preview`}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
