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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  TournamentAttachment,
  TournamentCategory,
  TournamentFormData,
  TournamentPostForm,
} from '@/types/tournaments';
import { Link, useForm } from '@inertiajs/react';
import { IconUpload } from '@tabler/icons-react';
import { isAfter, isEqual } from 'date-fns';
import { GalleryThumbnails, Wallpaper } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapPicker } from '../../../ui/leaflet/map-picker';
import PreviewTournamentPost from './preview-tournament-post';
import SelectCategory from './select-category';
import SelectDate from './select-date';

interface FormTournamentPostProps {
  tournamentPostData?: Partial<TournamentFormData>;
  categories: TournamentCategory[];
}

export default function FormTournamentPost({
  categories,
  tournamentPostData,
}: FormTournamentPostProps) {
  const {
    data,
    setData,
    post,
    patch,
    processing,
    errors,
    setError,
    clearErrors,
  } = useForm<TournamentPostForm>({
    id: tournamentPostData?.id,
    title: tournamentPostData?.title ?? '',
    slug: tournamentPostData?.slug ?? '',
    category_id: tournamentPostData?.category_id ?? '',
    description: tournamentPostData?.description ?? '',
    tags: tournamentPostData?.tags ?? '',

    prize_pool: tournamentPostData?.prize_pool ?? null,
    max_participants: tournamentPostData?.max_participants ?? null,

    location: tournamentPostData?.location ?? '',
    latitude: tournamentPostData?.latitude ?? null,
    longitude: tournamentPostData?.longitude ?? null,

    registration_start: tournamentPostData?.registration_start ?? '',
    registration_end: tournamentPostData?.registration_end ?? '',

    registration_fee: tournamentPostData?.registration_fee ?? 0,

    banner: null,
    thumbnail: null,

    start_date: tournamentPostData?.start_date ?? '',
    end_date: tournamentPostData?.end_date ?? '',

    mode: tournamentPostData?.mode ?? 'team',

    format: tournamentPostData?.format ?? 'single_elimination',
    team_size: tournamentPostData?.team_size ?? 1,

    status: tournamentPostData?.status ?? 'draft',
    is_featured: tournamentPostData?.is_featured ?? false,
    is_published: tournamentPostData?.is_published ?? false,
  });

  console.log(data.banner, data.thumbnail);

  // Banner
  const bannerAttachment = tournamentPostData?.attachments?.find(
    (a) => a.type === 'banner',
  );

  const [previewBanner, setPreviewBanner] = useState<string | null>(
    bannerAttachment ? `/storage/${bannerAttachment.path}` : null,
  );

  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData('banner', file);
    setPreviewBanner(URL.createObjectURL(file));
  };

  // Thumbnail
  const thumbnailAttachment = tournamentPostData?.attachments?.find(
    (a) => a.type === 'thumbnail',
  );

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(
    thumbnailAttachment ? `/storage/${thumbnailAttachment.path}` : null,
  );

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData('thumbnail', file);
    setPreviewThumbnail(URL.createObjectURL(file));
  };

  // UseEffect Banner and Thumbnail
  useEffect(() => {
    return () => {
      if (previewBanner?.startsWith('blob:')) {
        URL.revokeObjectURL(previewBanner);
        console.log('REVOKE BANNER', previewBanner);
      }
      if (previewThumbnail?.startsWith('blob:')) {
        URL.revokeObjectURL(previewThumbnail);
        console.log('REVOKE THUMB', previewThumbnail);
      }
    };
  }, []);

  // Rules
  const isUnlimitedParticipants = data.max_participants === null;
  const isUnlimitedPrizePool = data.prize_pool === null;

  useEffect(() => {
    if (data.mode === 'solo') {
      setData('team_size', 1);
    }
  }, [data.mode]);

  // Locations
  const isOnlineTournament = data.location === 'online';

  const tournamentMode = data.mode === 'team';

  useEffect(() => {
    if (data.latitude && data.longitude) {
      setLocationCoords({
        lat: data.latitude,
        lng: data.longitude,
      });
    }
  }, []);

  useEffect(() => {
    if (data.location === 'online') {
      setData('latitude', null);
      setData('longitude', null);
    }
  }, [data.location]);

  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Configurations
  useEffect(() => {
    if (!data.is_published) return;

    if (data.status === 'draft') {
      setData('status', 'upcoming');
    }
  }, [data.is_published, data.start_date]);

  // Wizard Form
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const totalFormSteps = 4;

  const hasFile = (file: File | null, attachment?: TournamentAttachment) =>
    !!file || !!attachment;

  const isStepOneValid =
    hasFile(data.banner, bannerAttachment) &&
    hasFile(data.thumbnail, thumbnailAttachment) &&
    data.title.trim() &&
    data.category_id;

  const isAfterOrEqual = (
    start?: string | Date | null,
    end?: string | Date | null,
  ) => {
    if (!start || !end) return false;

    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;

    return isAfter(endDate, startDate) || isEqual(endDate, startDate);
  };

  const isStepTwoValid =
    !!data.registration_start &&
    !!data.registration_end &&
    !!data.start_date &&
    !!data.end_date &&
    isAfterOrEqual(data.registration_start, data.registration_end) &&
    isAfterOrEqual(data.registration_end, data.start_date) &&
    isAfterOrEqual(data.start_date, data.end_date);

  const validateStepTwo = () => {
    let valid = true;
    clearErrors();

    if (!data.registration_start) {
      setError('registration_start', 'Registration start date is required');
      valid = false;
    }

    if (!data.registration_end) {
      setError('registration_end', 'Registration end date is required');
      valid = false;
    }

    if (
      data.registration_start &&
      data.registration_end &&
      !isAfterOrEqual(data.registration_start, data.registration_end)
    ) {
      setError(
        'registration_end',
        'Registration end date must be after registration start date',
      );
      valid = false;
    }

    if (!data.start_date) {
      setError('start_date', 'Tournament start date is required');
      valid = false;
    }

    if (!data.end_date) {
      setError('end_date', 'Tournament end date is required');
      valid = false;
    }

    if (
      data.start_date &&
      data.end_date &&
      !isAfterOrEqual(data.start_date, data.end_date)
    ) {
      setError('end_date', 'Tournament end date must be after start date');
      valid = false;
    }

    if (
      data.registration_end &&
      data.start_date &&
      !isAfterOrEqual(data.registration_end, data.start_date)
    ) {
      setError(
        'start_date',
        'Tournament start date must be after registration end date',
      );
      valid = false;
    }

    return valid;
  };

  const canGoNext =
    (formStep === 1 && isStepOneValid) ||
    (formStep === 2 && isStepTwoValid) ||
    formStep > 2;

  const handleNext = () => {
    clearErrors();

    /* ================= STEP 1 ================= */
    if (formStep === 1) {
      if (!hasFile(data.banner, bannerAttachment)) {
        setError('banner', 'Banner is required');
        return;
      }

      if (!hasFile(data.thumbnail, thumbnailAttachment)) {
        setError('thumbnail', 'Thumbnail is required');
        return;
      }

      if (!data.title.trim()) {
        setError('title', 'Title is required');
        return;
      }

      if (!data.category_id) {
        setError('category_id', 'Category is required');
        return;
      }
    }

    /* ================= STEP 2 ================= */
    if (formStep === 2) {
      // TEAM RULE
      if (data.mode === 'team' && data.team_size < 2) {
        setError(
          'team_size',
          'Team Mode must have at least 2 players per team',
        );
        return;
      }

      // REGISTRATION FEE
      if (data.registration_fee < 0) {
        setError('registration_fee', 'Registration fee cannot be negative');
        return;
      }

      // MAX PARTICIPANTS
      if (data.max_participants !== null && data.max_participants < 1) {
        setError('max_participants', 'Minimum participants is 1');
        return;
      }

      if (
        data.mode === 'team' &&
        data.max_participants !== null &&
        data.max_participants < data.team_size
      ) {
        setError(
          'max_participants',
          'Max participants must be greater than team size',
        );
        return;
      }

      // DATE RULES (reuse existing)
      if (!validateStepTwo()) return;
    }

    /* ================= STEP 3 ================= */
    if (formStep === 3 && data.location !== 'online') {
      if (!data.location.trim()) {
        setError('location', 'Location address is required');
        return;
      }

      if (!data.latitude || !data.longitude) {
        setError('location', 'Please select location on map');
        return;
      }
    }

    /* ================= STEP 4 ================= */
    if (formStep === 4) {
      if (data.is_published && data.status === 'draft') {
        setError('status', 'Published tournament cannot have draft status');
        return;
      }
    }

    setFormStep((s) => (s + 1) as typeof formStep);
  };

  useEffect(() => {
    if (data.id) {
      setData('_method' as any, 'patch');
    }
  }, [data.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(
      data.id
        ? `/administrator/tournaments/${data.slug}/edit`
        : '/administrator/tournaments/create',
      {
        forceFormData: true,
      },
    );
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
                <Button
                  variant={'outline'}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Back to Menu
                </Button>
              </Link>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-4">
              {['Basic Info', 'Rules & Dates', 'Location', 'Publish'].map(
                (label, index) => {
                  const stepNumber = (index + 1) as typeof formStep;
                  const isActive = formStep === stepNumber;
                  const isDone = formStep > stepNumber;

                  return (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className={[
                          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                          isActive && 'bg-primary text-primary-foreground',
                          isDone && 'bg-green-500 text-white',
                          !isActive &&
                            !isDone &&
                            'bg-muted text-muted-foreground',
                        ].join(' ')}
                      >
                        {stepNumber}
                      </div>
                      <span className="text-sm">{label}</span>
                    </div>
                  );
                },
              )}
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* Basic Info */}
              <div
                hidden={formStep !== 1}
                className="space-y-6 rounded-xl border p-6"
              >
                <h3 className="font-semibold">Tournament Information</h3>
                <div className="space-y-6 px-2">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* ===================== Banner ===================== */}
                    <div className="grid h-full flex-col gap-2 lg:col-span-2">
                      <Label className="mb-2">Banner *</Label>

                      <AspectRatio ratio={16 / 9}>
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl border"
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
                                  if (previewBanner?.startsWith('blob:')) {
                                    URL.revokeObjectURL(previewBanner);
                                  }
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
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground hover:bg-dark-3">
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

                      <input
                        type="file"
                        accept="image/*"
                        ref={bannerInputRef}
                        className="hidden"
                        onChange={handleBannerChange}
                      />

                      {/* Footer slot (error replaces text) */}
                      <div className="mt-2 min-h-[20px] text-xs">
                        {errors.banner ? (
                          <InputError message={errors.banner} />
                        ) : (
                          <p className="text-muted-foreground">
                            Appears on tournament detail page
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ===================== Thumbnail ===================== */}
                    <div className="grid h-full flex-col gap-2">
                      <Label>Thumbnail *</Label>

                      <div className="flex flex-1 items-center">
                        <AspectRatio
                          ratio={4.42 / 5}
                          className="w-full cursor-pointer"
                        >
                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl border"
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
                                    if (previewThumbnail?.startsWith('blob:')) {
                                      URL.revokeObjectURL(previewThumbnail);
                                    }
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
                              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground hover:bg-dark-3">
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
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={thumbnailInputRef}
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />

                      {/* Footer slot (error replaces text) */}
                      <div className="mt-2 min-h-[20px] text-xs">
                        {errors.thumbnail ? (
                          <InputError message={errors.thumbnail} />
                        ) : (
                          <p className="text-muted-foreground">
                            Used in tournament cards & listings
                          </p>
                        )}
                      </div>
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
                        autoComplete="title"
                      />
                      {/* Footer slot (error replaces text) */}
                      <div className="mt-1 min-h-[20px] text-xs">
                        {errors.title ? (
                          <InputError message={errors.title} />
                        ) : (
                          <p className="text-muted-foreground">
                            Max : 50 Character
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="grid gap-2">
                      <Label>Category *</Label>
                      <SelectCategory
                        value={data.category_id}
                        options={categories}
                        onChange={(value) => setData('category_id', value)}
                      />
                      {/* Footer slot (error replaces text) */}
                      <div className="mt-1 min-h-[20px] text-xs">
                        {errors.category_id ? (
                          <InputError message={errors.category_id} />
                        ) : (
                          <p className="text-muted-foreground">
                            Can't find your game? Contact the administrator.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-1">
                      Tags
                      <span className="tracking-wide text-muted-foreground">
                        (separate with commas)
                      </span>
                    </Label>
                    <Input
                      placeholder="e.g. Mobile Legends, PUBG Mobile, Valorant ..."
                      value={data.tags}
                      onChange={(e) => setData('tags', e.target.value)}
                      autoComplete="tags"
                    />
                  </div>

                  {/* Description */}
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={data.description}
                      placeholder="Enter tournament description..."
                      onChange={(e) => setData('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div
                hidden={formStep !== 2}
                className="space-y-6 rounded-xl border p-6"
              >
                <h3 className="font-semibold">Tournament Rules</h3>
                <div className="space-y-6 px-2">
                  {/* Mode */}
                  <div className="mb-6 flex items-center justify-between">
                    <Label>Mode (Solo / Team)</Label>

                    <div className="flex items-center space-x-2">
                      <Label>Solo</Label>
                      <Switch
                        checked={tournamentMode}
                        onCheckedChange={(checked) => {
                          setData('mode', checked ? 'team' : 'solo');
                          if (!checked) setData('team_size', 1);
                        }}
                      />
                      <Label>Team</Label>
                    </div>
                  </div>

                  {/* Team Size */}
                  {data.mode === 'team' && (
                    <div className="grid gap-2">
                      <Label>Players per Team</Label>

                      <Input
                        type="number"
                        className="h-12"
                        min={2}
                        value={data.team_size}
                        onChange={(e) =>
                          setData('team_size', Number(e.target.value))
                        }
                      />

                      {/* Footer slot (error replaces text) */}
                      <div className="mt-1 min-h-[20px] text-xs">
                        {errors.team_size ? (
                          <InputError message={errors.team_size} />
                        ) : (
                          <p className="text-muted-foreground">
                            Ex: 5 vs 5 player / 3 vs 3 player
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Registration Fee */}
                    <div className="grid gap-2">
                      <Label>Registration Fee</Label>

                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          className="h-12"
                          min={0}
                          value={data.registration_fee}
                          onChange={(e) =>
                            setData('registration_fee', Number(e.target.value))
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          IDR
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Set 0 for free tournament
                      </p>

                      <InputError message={errors.registration_fee} />
                    </div>

                    {/* Format */}
                    <div className="grid gap-2">
                      <Label>Format</Label>

                      <Select
                        value={data.format}
                        onValueChange={(value) =>
                          setData('format', value as typeof data.format)
                        }
                      >
                        <SelectTrigger className="h-12 cursor-pointer">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="single_elimination">
                            Single Elimination
                          </SelectItem>
                          <SelectItem value="double_elimination">
                            Double Elimination
                          </SelectItem>
                          <SelectItem value="round_robin">
                            Round Robin
                          </SelectItem>
                          <SelectItem value="group_stage">
                            Group Stage
                          </SelectItem>
                          <SelectItem value="swiss_system">Swiss</SelectItem>
                        </SelectContent>
                      </Select>

                      <p className="text-xs text-muted-foreground">
                        Match system
                      </p>

                      <InputError message={errors.format} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Max Participants */}
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

                  {/* Date */}
                  <div className="flex w-full flex-col gap-4">
                    {/* Registration Date */}
                    <div className="grid w-full gap-2">
                      <Label>Registration Date *</Label>
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="w-full flex-col">
                          <SelectDate
                            label="Start"
                            value={data.registration_start}
                            onChange={(value) =>
                              setData('registration_start', value)
                            }
                          />
                          <InputError
                            className="px-2"
                            message={errors.registration_start}
                          />
                        </div>
                        <div className="w-full flex-col">
                          <SelectDate
                            label="End"
                            value={data.registration_end}
                            onChange={(value) =>
                              setData('registration_end', value)
                            }
                          />
                          <InputError
                            className="px-2"
                            message={errors.registration_end}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Tournament Date */}
                    <div className="grid w-full gap-2">
                      <Label>Tournament Date *</Label>
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex w-full flex-col">
                          <SelectDate
                            label="Start"
                            value={data.start_date}
                            onChange={(value) => setData('start_date', value)}
                          />
                          <InputError
                            className="px-2"
                            message={errors.start_date}
                          />
                        </div>
                        <div className="flex w-full flex-col">
                          <SelectDate
                            label="End"
                            value={data.end_date}
                            onChange={(value) => setData('end_date', value)}
                          />
                          <InputError
                            className="px-2"
                            message={errors.end_date}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div
                hidden={formStep !== 3}
                className="space-y-6 rounded-xl border p-6"
              >
                <h3 className="font-semibold">Tournament Location</h3>

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
                      <Label>Address*</Label>
                      <Input
                        placeholder="Enter tournament address"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                      />
                      {/* Footer slot (error replaces text) */}
                      <div className="mt-1 min-h-[20px] text-xs">
                        {errors.location ? (
                          <InputError message={errors.location} />
                        ) : (
                          <p className="text-muted-foreground">
                            Enter the full address to help participants find the
                            location.
                          </p>
                        )}
                      </div>
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
              <div
                hidden={formStep !== 4}
                className="space-y-6 rounded-xl border p-6"
              >
                <h3 className="font-semibold">Tournament Configurations</h3>

                <div className="space-y-6 px-2">
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
                        <SelectItem value="draft" disabled={data.is_published}>
                          Draft
                        </SelectItem>

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
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={formStep === 1}
                  onClick={() => setFormStep((s) => (s - 1) as typeof formStep)}
                >
                  Back
                </Button>

                {formStep < totalFormSteps && (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                )}

                {formStep === totalFormSteps && (
                  <Button type="submit" disabled={processing}>
                    Save Tournament
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-1">
            <div className="sticky top-38 space-y-6">
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
