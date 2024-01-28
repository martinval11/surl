'use client';

import { Ref, useRef, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

import Link from 'next/link';
import { db } from '@/lib/localMySQL';

import { URLSListProps } from './types/types';

export const URLSList = ({ urls }: { urls: URLSListProps[] }) => {
  const [urlList, setUrlList] = useState<URLSListProps[]>(urls);
  const linkNameRef: Ref<HTMLInputElement> | any =
    useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const filterUrlList = () => {
    if (linkNameRef.current) {
      const filteredList = urls.filter((url) =>
        url.url.includes(linkNameRef.current.value)
      );

      setUrlList(filteredList);
    }
  };

  const deleteUrl = async (event: any) => {
    const id = event.target.id;

    const filteredList = urlList.filter((url) => url.id !== id);
    setUrlList(filteredList);

    const deleteShortenedURLOnDatabase = await db('api/deleteUrlByUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (deleteShortenedURLOnDatabase.ok) {
      return toast({
        title: 'URL deleted successfully!',
      });
    }
    return toast({
      title: 'Something went wrong while deleting the URL',
      description: 'Please try again later.',
    })
  };

  return (
    <>
      <section>
        <Input
          type="url"
          placeholder="Search links"
          ref={linkNameRef}
          onChange={filterUrlList}
        />
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {urlList.map((url: URLSListProps) => (
          <Link
            href={`${window?.location.origin}/${url.id}`}
            key={url.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{url.id}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      data-cy="options-button"
                    >
                      <MoreVertical />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem id={url.id} onClick={deleteUrl}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent>
                <CardDescription className="flex flex-col">
                  <span>{url.url}</span>
                  <span>Expires on {url.expiration_date.slice(0, 10)}</span>
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
};