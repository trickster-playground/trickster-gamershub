/**
 * Node Modules
 */
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';

/**
 * Assets
 */
import { IconTrash, IconUpload } from '@tabler/icons-react';

interface FileObject {
  file: File & { path?: string; file_name?: string; updated_at?: number };
  preview: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface PostUploadProps {
  onChange?: (data: {
    files: (
      | File
      | { path?: string; file_name?: string; updated_at?: number }
    )[];
    deletedFile: FileObject | null;
  }) => void;
  value?: (
    | File
    | {
        id: number;
        path?: string;
        file_name?: string;
        size: number;
        type: string;
        updated_at?: string;
        modified?: number;
      }
  )[];
}

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

export const PostUpload: React.FC<PostUploadProps> = ({
  onChange,
  value = [],
}) => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialFileObjects = value.map((file) => {
      const castedFile = file as File;
      return {
        file: castedFile,
        preview: (file as { path?: string }).path
          ? (file as { path?: string }).path!
          : URL.createObjectURL(castedFile),
        name: (file as { file_name?: string }).file_name ?? castedFile.name,
        size: castedFile.size,
        type: castedFile.type,
        lastModified:
          typeof (file as any).modified === 'number'
            ? (file as any).modified
            : typeof (file as any).updated_at === 'string'
              ? new Date((file as any).updated_at).getTime()
              : castedFile.lastModified,
      };
    });

    setFiles(initialFileObjects);

    return () => {
      initialFileObjects.forEach((fileObj) => {
        if (!('path' in fileObj.file)) URL.revokeObjectURL(fileObj.preview);
      });
    };
  }, [value]);

  const handleFileChange = (newFiles: File[]) => {
    const updatedFiles = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    setFiles((prevFiles) => {
      const mergedFiles = [...prevFiles, ...updatedFiles];

      setTimeout(() => {
        onChange?.({
          files: mergedFiles.map((f) => f.file),
          deletedFile: null,
        });
      }, 0);

      return mergedFiles;
    });
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const deletedFile = updatedFiles.splice(index, 1)[0];

      setTimeout(() => {
        onChange?.({
          files: updatedFiles.map((f) => f.file),
          deletedFile,
        });
      }, 0);

      if (!deletedFile.file.path) URL.revokeObjectURL(deletedFile.preview);
      return updatedFiles;
    });
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        whileHover="animate"
        className="relative block w-full rounded-lg p-10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          {!files.length && (
            <div
              className="flex cursor-pointer flex-col items-center justify-center"
              onClick={handleClick}
            >
              <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
                Upload file
              </p>
              <p className="relative z-40 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
                Drag or drop your files here or click to upload
              </p>
            </div>
          )}

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.map((fileObj, index) => (
              <motion.div
                key={'file' + index}
                layoutId={index === 0 ? 'file-upload' : `file-upload-${index}`}
                className="relative z-20 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 shadow-sm dark:bg-neutral-900"
              >
                <div className="mx-auto flex w-full flex-1 items-center justify-center p-10">
                  <img
                    src={fileObj.preview}
                    alt="image"
                    className="file_uploader-img"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleDeleteFile(index)}
                  className="absolute top-2 right-2 z-50 text-red-400 hover:text-red-500"
                >
                  <IconTrash className="size-5" />
                </Button>
                <div className="mt-2 flex w-full items-center justify-between gap-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                  >
                    {fileObj.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="w-fit flex-shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                  >
                    {(fileObj.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>

                <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800"
                  >
                    {fileObj.type}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    modified{' '}
                    {new Date(fileObj.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
              </motion.div>
            ))}

            {files.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  onClick={handleClick}
                  className="absolute"
                >
                  Click here to upload more
                </Button>
              </div>
            )}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                onClick={handleClick}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] cursor-pointer items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl dark:bg-neutral-900"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-600"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex flex-shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-gray-50 dark:bg-neutral-950'
                  : 'bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
