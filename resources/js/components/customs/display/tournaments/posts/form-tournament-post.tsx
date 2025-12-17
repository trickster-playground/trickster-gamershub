import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import PreviewTournamentPost from './preview-tournament-post';
import SelectCategory from './select-category';

type CategoryOption = {
  id: number;
  name: string;
  color: string;
};

type TournamentFormData = {
  title: string;
  slug: string;
  tournament_category_id: number | '';
  description: string;

  prize_pool: number | '';
  max_participants: number | null;

  mode: 'online' | 'lan' | '';
  location: string;

  registration_start: string;
  registration_end: string;
  start_date: string;
  end_date: string;

  status: 'draft' | 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
  is_featured: boolean;
  is_published: boolean;
};

type Props = {
  categories: CategoryOption[];
  initialData?: Partial<TournamentFormData>;
};

export default function FormTournamentPost({ categories, initialData }: Props) {
  const { data, setData, post, processing, errors } =
    useForm<TournamentFormData>({
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      tournament_category_id: initialData?.tournament_category_id ?? '',
      description: initialData?.description ?? '',

      prize_pool: initialData?.prize_pool ?? '',
      max_participants: initialData?.max_participants ?? null,

      mode: initialData?.mode ?? '',
      location: initialData?.location ?? '',

      registration_start: initialData?.registration_start ?? '',
      registration_end: initialData?.registration_end ?? '',
      start_date: initialData?.start_date ?? '',
      end_date: initialData?.end_date ?? '',

      status: initialData?.status ?? 'draft',
      is_featured: initialData?.is_featured ?? false,
      is_published: initialData?.is_published ?? false,
    });

    const isUnlimited = data.max_participants === null


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
                title={initialData ? 'Edit Tournament' : 'Create Tournament'}
                description="Manage tournament main information"
              />
              <Link href="/administrator/tournaments">
                <Button variant="outline">Back</Button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* BASIC INFO */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-4 h-fit w-fit rounded-lg bg-primary p-3 text-sm font-semibold">
                  Tournament Information
                </h3>

                <div className="space-y-4 px-2">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Title */}
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input
                        className="h-14"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        maxLength={50}
                      />
                      <InputError message={errors.title} />
                    </div>

                    {/* Category */}
                    <div className="grid gap-2">
                      <Label>Category</Label>
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
                          className="h-14"
                          value={data.max_participants ?? ''}
                          disabled={isUnlimited}
                          min={1}
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
                            checked={isUnlimited}
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
                      <Input
                        type="number"
                        className="h-14"
                        value={data.prize_pool}
                        placeholder="e.g 100000000"
                        onChange={(e) =>
                          setData(
                            'prize_pool',
                            e.target.value === '' ? '' : Number(e.target.value),
                          )
                        }
                        min={0}
                      />

                      <InputError message={errors.prize_pool} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-4 rounded-xl border p-6">
                <h3 className="font-semibold">Status</h3>

                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch
                    checked={data.is_featured}
                    onCheckedChange={(v) => setData('is_featured', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch
                    checked={data.is_published}
                    onCheckedChange={(v) => setData('is_published', v)}
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
            <div className="sticky top-24 space-y-3">
              <HeadingSmall
                title={initialData ? 'Preview Card' : 'Preview Card'}
                description="Live preview of your tournament card"
              />
              <PreviewTournamentPost data={data} categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
