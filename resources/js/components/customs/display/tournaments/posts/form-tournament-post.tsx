import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  TournamentCategory,
  TournamentPost,
  TournamentPostForm,
} from '@/types/tournaments';
import { Link, useForm } from '@inertiajs/react';
import { IconUpload } from '@tabler/icons-react';
import { GalleryThumbnails, Wallpaper } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapPicker } from '../../ui/leaflet/map-picker';
import PreviewTournamentPost from './preview-tournament-post';
import SelectCategory from './select-category';
import SelectDate from './select-date';

interface FormTournamentPostProps {
  tournamentPostData?: Partial<TournamentPost>;
  categories: TournamentCategory[];
}

export default function FormTournamentPost({
  categories,
  tournamentPostData,
}: FormTournamentPostProps) {
  const { data, setData, post, processing, errors } =
    useForm<TournamentPostForm>({
      id: tournamentPostData?.id ?? null,
      title: tournamentPostData?.title ?? '',
      slug: tournamentPostData?.slug ?? '',
      tournament_category_id: tournamentPostData?.tournament_category_id ?? '',
      description: tournamentPostData?.description ?? '',
      tags: tournamentPostData?.tags ?? '',

      prize_pool: tournamentPostData?.prize_pool ?? null,
      max_participants: tournamentPostData?.max_participants ?? null,

      mode: tournamentPostData?.mode ?? '',

      location: tournamentPostData?.location ?? '',
      latitude: tournamentPostData?.latitude ?? null,
      longitude: tournamentPostData?.longitude ?? null,

      registration_start: tournamentPostData?.registration_start ?? '',
      registration_end: tournamentPostData?.registration_end ?? '',

      banner: null,
      thumbnail: null,

      start_date: tournamentPostData?.start_date ?? '',
      end_date: tournamentPostData?.end_date ?? '',

      status: tournamentPostData?.status ?? 'draft',
      is_featured: tournamentPostData?.is_featured ?? false,
      is_published: tournamentPostData?.is_published ?? false,
    });

  const bannerAttachment = tournamentPostData?.attachments?.find(
    (a) => a.type === 'banner',
  );

  const thumbnailAttachment = tournamentPostData?.attachments?.find(
    (a) => a.type === 'thumbnail',
  );

  const [previewBanner, setPreviewBanner] = useState<string | null>(
    bannerAttachment ? `/storage/${bannerAttachment.path}` : null,
  );

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(
    thumbnailAttachment ? `/storage/${thumbnailAttachment.path}` : null,
  );

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData('banner', file);
    setPreviewBanner(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData('thumbnail', file);
    setPreviewThumbnail(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewBanner?.startsWith('blob:')) {
        URL.revokeObjectURL(previewBanner);
      }
      if (previewThumbnail?.startsWith('blob:')) {
        URL.revokeObjectURL(previewThumbnail);
      }
    };
  }, [previewBanner, previewThumbnail]);

  const isUnlimitedParticipants = data.max_participants === null;
  const isUnlimitedPrizePool = data.prize_pool === null;
  const isOnlineTournament = data.location === 'online';

  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/administrator/tournaments');
  };

  return (
    <>
      <div className="mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* FORM */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <HeadingSmall
                title={
                  tournamentPostData ? 'Edit Tournament' : 'Create Tournament'
                }
                description="Manage tournament main information"
              />
              <Link href="/administrator/tournaments">
                <Button variant="outline">Back</Button>
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* BASIC INFO */}
              <div className="rounded-xl border p-6">
                <div className="space-y-6 px-2">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Banner */}
                    <div className="grid gap-2 lg:col-span-2">
                      <Label className="mb-2">Banner *</Label>

                      <AspectRatio ratio={16 / 9}>
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="relative h-full w-full overflow-hidden rounded-xl border"
                        >
                          {previewBanner ? (
                            <>
                              <img
                                src={previewBanner}
                                className="h-full w-full object-cover"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2 bg-background hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewBanner(null);
                                  setData('banner', null);
                                  if (bannerInputRef.current)
                                    bannerInputRef.current.value = '';
                                }}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <div className="flex h-full w-full cursor-pointer items-center justify-center text-sm text-muted-foreground hover:bg-dark-3">
                              <Empty>
                                <EmptyHeader>
                                  <EmptyMedia variant="icon">
                                    <Wallpaper size={32} />
                                  </EmptyMedia>
                                  <EmptyTitle>No banner uploaded</EmptyTitle>
                                  <EmptyDescription>
                                    Upload banner for your tournament.
                                  </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                  <Label className="flex cursor-pointer items-center gap-2 text-sm hover:underline">
                                    <IconUpload size={16} />
                                    Choose File
                                  </Label>
                                </EmptyContent>
                              </Empty>
                            </div>
                          )}
                        </button>
                      </AspectRatio>

                      <InputError message={errors.banner} />

                      <input
                        type="file"
                        accept="image/*"
                        ref={bannerInputRef}
                        className="hidden"
                        onChange={handleBannerChange}
                      />

                      <p className="text-xs text-muted-foreground">
                        Appears on tournament detail page
                      </p>
                    </div>

                    {/* Thumbnail */}
                    <div className="grid gap-2">
                      <Label>Thumbnail *</Label>

                      <div className="mb-13 flex h-full items-center">
                        <div className="w-full">
                          <AspectRatio ratio={1 / 1} className="cursor-pointer">
                            <button
                              type="button"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="relative h-full w-full overflow-hidden rounded-xl border"
                            >
                              {previewThumbnail ? (
                                <>
                                  <img
                                    src={previewThumbnail}
                                    className="h-full w-full object-cover"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-2 right-2 bg-background hover:bg-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewThumbnail(null);
                                      setData('thumbnail', null);
                                      if (thumbnailInputRef.current)
                                        thumbnailInputRef.current.value = '';
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </>
                              ) : (
                                <div className="flex h-full w-full cursor-pointer items-center justify-center text-sm text-muted-foreground hover:bg-dark-3">
                                  <Empty>
                                    <EmptyHeader>
                                      <EmptyMedia variant="icon">
                                        <GalleryThumbnails size={32} />
                                      </EmptyMedia>
                                      <EmptyTitle>
                                        No thumbnail uploaded
                                      </EmptyTitle>
                                      <EmptyDescription>
                                        Upload thumbnail for your tournament.
                                      </EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                      <Label className="flex cursor-pointer items-center gap-2 text-sm hover:underline">
                                        <IconUpload size={16} />
                                        Choose File
                                      </Label>
                                    </EmptyContent>
                                  </Empty>
                                </div>
                              )}
                            </button>
                          </AspectRatio>

                          <InputError message={errors.thumbnail} />

                          <input
                            type="file"
                            accept="image/*"
                            ref={thumbnailInputRef}
                            className="hidden"
                            onChange={handleThumbnailChange}
                          />
                        </div>
                      </div>
                      <p className="mt-0 text-xs text-muted-foreground">
                        Used in tournament cards & listings
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Title */}
                    <div className="grid gap-2">
                      <Label>Title *</Label>
                      <Input
                        className="h-12"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        maxLength={50}
                        placeholder="Enter tournament title..."
                      />
                      <InputError message={errors.title} />
                    </div>

                    {/* Category */}
                    <div className="grid gap-2">
                      <Label>Category *</Label>
                      <SelectCategory
                        value={data.tournament_category_id}
                        options={categories}
                        onChange={(value) =>
                          setData('tournament_category_id', value)
                        }
                      />
                      <InputError message={errors.tournament_category_id} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Max Participants</Label>

                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          className="h-12"
                          value={data.max_participants ?? ''}
                          disabled={isUnlimitedParticipants}
                          min={1}
                          placeholder="Unlimited"
                          onChange={(e) =>
                            setData(
                              'max_participants',
                              e.target.value === ''
                                ? null
                                : Number(e.target.value),
                            )
                          }
                        />

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isUnlimitedParticipants}
                            onCheckedChange={(checked) =>
                              setData('max_participants', checked ? null : 16)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            Unlimited
                          </span>
                        </div>
                      </div>

                      <InputError message={errors.max_participants} />
                    </div>

                    {/* Prize Pool */}
                    <div className="grid gap-2">
                      <Label>Prize Pool</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          className="h-12"
                          value={data.prize_pool ?? ''}
                          disabled={isUnlimitedPrizePool}
                          placeholder="Unlimited"
                          onChange={(e) =>
                            setData(
                              'prize_pool',
                              e.target.value === ''
                                ? null
                                : Number(e.target.value),
                            )
                          }
                          min={0}
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isUnlimitedPrizePool}
                            onCheckedChange={(checked) =>
                              setData('prize_pool', checked ? null : 10000000)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            Unlimited
                          </span>
                        </div>
                      </div>

                      <InputError message={errors.prize_pool} />
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="grid w-full gap-2">
                      <Label>Registration Date *</Label>

                      <div className="flex flex-col gap-3">
                        <SelectDate
                          label="Start"
                          value={data.registration_start}
                          onChange={(value) =>
                            setData('registration_start', value)
                          }
                        />

                        <SelectDate
                          label="End"
                          value={data.registration_end}
                          onChange={(value) =>
                            setData('registration_end', value)
                          }
                        />
                      </div>
                    </div>

                    {/* Prize Pool */}
                    <div className="grid w-full gap-2">
                      <Label>Tournament Date *</Label>
                      <div className="flex flex-col gap-3">
                        <SelectDate
                          label="Start"
                          value={data.start_date}
                          onChange={(value) => setData('start_date', value)}
                        />

                        <SelectDate
                          label="End"
                          value={data.end_date}
                          onChange={(value) => setData('end_date', value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={data.description}
                      placeholder="Enter tournament description..."
                      onChange={(e) => setData('description', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>
                      Tags{' '}
                      <span className="tracking-wide text-muted-foreground">
                        (separate with commas)
                      </span>
                    </Label>
                    <Input
                      placeholder="e.g. Mobile Legends, PUBG Mobile, Valorant ..."
                      value={data.tags}
                      onChange={(e) => setData('tags', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <h2 className="mb-4 flex h-8 w-fit items-center rounded-lg bg-primary p-3 text-center text-sm font-semibold">
                Other Information
              </h2>

              {/* Location */}
              <div className="space-y-4 rounded-xl border p-6">
                <h3 className="font-semibold">Location</h3>

                <div className="flex items-center justify-between px-2">
                  <Label>
                    {isOnlineTournament
                      ? 'Online Tournament'
                      : 'Offline Tournament'}
                  </Label>

                  <div className="flex items-center space-x-2">
                    <Label>Offline</Label>
                    <Switch
                      checked={isOnlineTournament}
                      onCheckedChange={(checked) => {
                        setData('location', checked ? 'online' : '');
                      }}
                    />
                    <Label>Online</Label>
                  </div>
                </div>

                {!isOnlineTournament && (
                  <div className="space-y-4 px-2">
                    <div className="grid gap-2">
                      <Label>Address</Label>
                      <Input
                        placeholder="Enter tournament address"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                      />
                    </div>

                    <div className="h-[500px] w-full rounded-lg border">
                      <MapPicker
                        value={locationCoords ?? undefined}
                        onChange={(coords) => {
                          setLocationCoords(coords);
                          setData('latitude', coords.lat);
                          setData('longitude', coords.lng);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Configurations */}
              <div className="space-y-5 rounded-xl border p-6">
                <h3 className="font-semibold">Configurations</h3>

                {/* Status */}
                <div className="grid gap-2">
                  <Label>Status</Label>

                  <Select
                    value={data.status}
                    onValueChange={(value) =>
                      setData('status', value as typeof data.status)
                    }
                  >
                    <SelectTrigger className="h-12 cursor-pointer">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <InputError message={errors.status} />
                </div>

                {/* Published */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Published</Label>
                    <p className="text-xs text-muted-foreground">
                      Visible to public users
                    </p>
                  </div>
                  <Switch
                    checked={data.is_published}
                    onCheckedChange={(v) => setData('is_published', v)}
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Featured</Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight this tournament
                    </p>
                  </div>
                  <Switch
                    checked={data.is_featured}
                    onCheckedChange={(v) => setData('is_featured', v)}
                  />
                </div>
              </div>

              <Button disabled={processing} className="w-full">
                Save Tournament
              </Button>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <HeadingSmall
                title={tournamentPostData ? 'Preview Card' : 'Preview Card'}
                description="Live preview of your tournament card"
              />
              <PreviewTournamentPost
                data={data}
                categories={categories}
                thumbnailPreview={previewThumbnail}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
