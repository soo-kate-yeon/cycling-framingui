'use client';

import * as React from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  Calendar,
} from '@framingui/ui';
import {
  Bell,
  Calculator,
  Calendar as CalendarIcon,
  CreditCard,
  Settings,
  Smile,
  User,
  Plus,
  LogOut,
  Mail,
  Menu,
} from 'lucide-react';

export function ComponentGallery() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full pb-20 animate-in fade-in duration-500">
      <div className="mb-8 sm:mb-10 lg:mb-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3 text-[var(--bg-foreground)]">
          Component Gallery
        </h2>
        <p className="text-[var(--bg-muted-foreground)] text-sm sm:text-base lg:text-lg leading-relaxed">
          Beautifully designed components that you can copy and paste into your apps. Accessible.
          Customizable. Open Source.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
        {/* 컬럼 1 */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Card Form */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select defaultValue="next">
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>

          {/* Form Controls / Switches */}
          <Card className="shadow-none">
            <CardContent className="p-4 sm:p-6 grid gap-4 sm:gap-6">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="airplane-mode" className="flex flex-col space-y-1">
                  <span>Airplane Mode</span>
                  <span className="font-normal leading-snug text-[var(--bg-muted-foreground)] text-xs sm:text-sm">
                    Turn off all incoming connections.
                  </span>
                </Label>
                <Switch id="airplane-mode" defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                  <span>Marketing Emails</span>
                  <span className="font-normal leading-snug text-[var(--bg-muted-foreground)] text-xs sm:text-sm">
                    Receive emails about new products.
                  </span>
                </Label>
                <Switch id="marketing-emails" className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Command Menu */}
          <Card className="shadow-none p-3 sm:p-4 overflow-hidden">
            <Command className="shadow-none">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem>
                    <Smile className="mr-2 h-4 w-4" />
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem>
                    <Calculator className="mr-2 h-4 w-4" />
                    <span>Calculator</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Card>

          {/* Notifications */}
          <Card className="shadow-none p-4 sm:p-6 space-y-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bg-foreground)]" />
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium leading-none">Everything is updated</p>
                <p className="text-xs sm:text-sm text-[var(--bg-muted-foreground)]">
                  You have no pending updates.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bg-foreground)]" />
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium leading-none">New message received</p>
                <p className="text-xs sm:text-sm text-[var(--bg-muted-foreground)]">
                  Alice replied to your comment.
                </p>
              </div>
            </div>
          </Card>

          {/* Nav & Sidebar — MCP 레시피: 내부 섹션 구분은 spacing만, divider 없음 */}
          <Card className="shadow-none overflow-hidden">
            <div className="px-4 sm:px-6 py-4">
              <Label className="uppercase tracking-wide text-xs text-[var(--bg-muted-foreground)]">
                Navigation
              </Label>
            </div>

            {/* Nav 아이템 — divider 없이 gap/padding으로만 구분 */}
            <nav className="flex flex-col px-2 pb-2">
              {[
                { label: 'Dashboard', active: true },
                { label: 'Analytics', active: false },
                { label: 'Reports', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors ${
                    item.active
                      ? 'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)]'
                      : 'text-[var(--bg-muted-foreground)] hover:text-[var(--bg-foreground)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* 하단 설정 그룹 — border 없이 pt로 spacing만 */}
            <div className="px-4 sm:px-6 pt-4 pb-4 space-y-1">
              {[
                { label: 'Settings', icon: Settings },
                { label: 'Billing', icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-[var(--bg-muted-foreground)] hover:text-[var(--bg-foreground)] hover:bg-[var(--bg-muted)] transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 컬럼 2 */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Calendar */}
          <Card className="shadow-none p-3 overflow-x-auto">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </Card>

          {/* User Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-none p-4 flex flex-col items-center justify-center gap-3 text-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">shadcn</p>
                <p className="text-xs text-[var(--bg-muted-foreground)]">m@example.com</p>
              </div>
              <Button variant="outline" className="w-full mt-2 text-xs h-8">
                View Profile
              </Button>
            </Card>

            <Card className="shadow-none p-4 flex flex-col gap-3 justify-center">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide">Display Progress</Label>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2 mt-2">
                <Label className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox id="marketing2" defaultChecked />
                  Subscribe to newsletter
                </Label>
              </div>
            </Card>
          </div>

          <Card className="shadow-none p-4 sm:p-6 space-y-6">
            <div className="space-y-3">
              <Label className="uppercase tracking-wide text-xs text-[var(--bg-muted-foreground)]">
                Labels & Badges
              </Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="uppercase tracking-wide text-xs text-[var(--bg-muted-foreground)]">
                Action Buttons
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Loading States (Skeleton)</Label>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Overlays & Modals */}
          <Card className="shadow-none p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold leading-none uppercase tracking-wide text-xs text-[var(--bg-muted-foreground)] mb-3">
                  Overlays & Modals
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Dialog
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-2rem)]">
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="d-name" className="text-right text-xs">
                            Name
                          </Label>
                          <Input id="d-name" defaultValue="Pedro Duarte" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Alert
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100vw-2rem)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        Popover
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 sm:w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold leading-none text-sm">Dimensions</h4>
                          <p className="text-sm text-[var(--bg-muted-foreground)]">
                            Set the dimensions for the layer.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        Sheet
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Mobile Navigation</SheetTitle>
                        <SheetDescription>
                          Navigate quickly through your application sections.
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to library</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 컬럼 3 */}
        <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-1 md:col-span-2">
          {/* Data Table */}
          <Card className="shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>
                      <Badge>PAID</Badge>
                    </TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV002</TableCell>
                    <TableCell>
                      <Badge variant="secondary">PENDING</Badge>
                    </TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV003</TableCell>
                    <TableCell>
                      <Badge variant="outline">UNPAID</Badge>
                    </TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Text Areas and Inputs */}
          <Card className="shadow-none p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Feedback</Label>
              <Textarea
                id="message"
                placeholder="Type your message here."
                className="resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <RadioGroup defaultValue="3" className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="star1" />
                  <Label htmlFor="star1">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="star2" />
                  <Label htmlFor="star2">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="star3" />
                  <Label htmlFor="star3">High</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          {/* Account Tabs */}
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Make changes to your account here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="username2" className="text-xs uppercase tracking-wide">
                      Name
                    </Label>
                    <Input id="username2" defaultValue="John Doe" />
                  </div>
                  <Button className="w-full mt-6">Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="current" className="text-xs uppercase tracking-wide">
                      Current
                    </Label>
                    <Input id="current" type="password" />
                  </div>
                  <Button className="w-full mt-6">Save password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <Card className="shadow-none p-6 overflow-x-auto flex flex-col gap-6 items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="mr-2 h-4 w-4" /> Options Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        </div>
      </div>
    </div>
  );
}
