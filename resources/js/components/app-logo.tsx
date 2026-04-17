export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sidebar-primary ring-1 ring-sidebar-primary/20">
                <img
                    src="/logo-casa-imobby.png"
                    alt=""
                    className="size-7 object-contain"
                    width={28}
                    height={28}
                />
            </div>
            <div className="ml-1 grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate">
                    <span className="font-brand text-[15px] font-semibold tracking-wide text-sidebar-foreground">
                        Casa{' '}
                    </span>
                    <span className="font-sans text-[13px] font-bold tracking-wide text-sidebar-foreground">
                        Imobby
                    </span>
                </span>
            </div>
        </>
    );
}
