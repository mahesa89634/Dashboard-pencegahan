export const composeCodeSnippets: Record<string, { title: string; code: string; desc: string }> = {
  home: {
    title: "HomeScreen.kt",
    desc: "The main dashboard implemented with Material 3, containing a grid layout of actionable modules for Fire Prevention and Infrastructure.",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

// Primary Theme Colors (Red & Dark Blue)
val FireRed = Color(0xFFDC2626)
val DarkBlue = Color(0xFF1E3A8A)

data class MenuCategory(
    val title: String,
    val icon: ImageVector,
    val route: String,
    val badgeCount: Int = 0
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigate: (String) -> Unit
) {
    val menuItems = listOf(
        MenuCategory("Inspeksi Proteksi", Icons.Default.Shield, "inspeksi", badgeCount = 2),
        MenuCategory("Pemberdayaan Warga", Icons.Default.People, "pemberdayaan"),
        MenuCategory("Relawan (REDKAR)", Icons.Default.Handshake, "redkar"),
        MenuCategory("Pembinaan Aparatur", Icons.Default.School, "pembinaan"),
        MenuCategory("NSPM", Icons.Default.Book, "nspm")
    )

    Scaffold(
        topBar = {
            MediumTopAppBar(
                title = { 
                    Column {
                        Text(
                            "Damkarmat Kota Bima",
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                        Text(
                            "Pencegahan & Proteksi Kebakaran",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f)
                        )
                    }
                },
                colors = TopAppBarDefaults.mediumTopAppBarColors(
                    containerColor = DarkBlue,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                ),
                actions = {
                    IconButton(onClick = { /* Handle Profile */ }) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Profile",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero section with status summary
            Card(
                colors = CardDefaults.cardColors(containerColor = FireRed),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "KONDISI KESIAPSIAGAAN",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Kota Bima Siaga Damkar",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Text(
                        "Layanan Kedaruratan & Pengawasan Proteksi Gedung Aktif",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f)
                    )
                }
            }

            Text(
                text = "Menu Pencegahan Damkarmat",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 4.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(menuItems) { menu ->
                    MenuCard(menu = menu, onClick = { onNavigate(menu.route) })
                }
            }
        }
    }
}

@Composable
fun MenuCard(
    menu: MenuCategory,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(130.dp)
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = menu.icon,
                    contentDescription = menu.title,
                    tint = FireRed,
                    modifier = Modifier.size(36.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = menu.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    maxLines = 2
                )
            }
            
            if (menu.badgeCount > 0) {
                Badge(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp)
                ) {
                    Text("\${menu.badgeCount}")
                }
            }
        }
    }
}`
  },
  inspeksi: {
    title: "InspeksiScreen.kt",
    desc: "Displays building fire safety inspections. Implemented with dynamic state, filter badges, status-colored cards, and a reactive Floating Action Button.",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// Mock Data Struct
data class InspeksiItem(
    val id: String,
    val name: String,
    val date: String,
    val status: String, // "Perlu Perbaikan", "Kritis", "Aman"
    val address: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InspeksiScreen(
    onBack: () -> Unit,
    onAddNew: () -> Unit
) {
    // Dynamic inspection list state
    var inspeksiList by remember {
        mutableStateOf(
            listOf(
                InspeksiItem("1", "SPPG Rabadompu Barat", "10 Jun 2026", "Perlu Perbaikan", "Jl. Rabadompu Barat, Kota Bima"),
                InspeksiItem("2", "Pasar Raya Bima", "05 Jun 2026", "Kritis", "Pusat Kota Bima")
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Inspeksi Proteksi", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBlue,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddNew,
                containerColor = FireRed,
                contentColor = Color.White
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Tambah Inspeksi")
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // Dashboard inspection search / filter row
            Text(
                "Rekapitulasi Proteksi Aktif",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(inspeksiList) { item ->
                    InspeksiCard(item)
                }
            }
        }
    }
}

@Composable
fun InspeksiCard(item: InspeksiItem) {
    val statusColor = when (item.status) {
        "Kritis" -> Color(0xFFEF4444) // Red
        "Perlu Perbaikan" -> Color(0xFFF59E0B) // Orange/Yellow
        else -> Color(0xFF10B981) // Green (Safe)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Business,
                        contentDescription = null,
                        tint = DarkBlue
                    )
                    Text(
                        text = item.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                // Status badge
                Surface(
                    color = statusColor.copy(alpha = 0.15f),
                    shape = ShapeDefaults.Small
                ) {
                    Text(
                        text = item.status,
                        color = statusColor,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Heavy,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.CalendarToday,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = Color.Gray
                )
                Text(
                    text = "Diperiksa: \${item.date}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray
                )
            }
            
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Lokasi: \${item.address}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
    }
}`
  },
  pemberdayaan: {
    title: "PemberdayaanScreen.kt",
    desc: "A socialization recap screen displaying citizen awareness activities like cooking safety and school training, featuring lists and card layouts.",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.PeopleOutline
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class SosialisasiRecap(
    val title: String,
    val date: String,
    val location: String,
    val participants: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PemberdayaanScreen(
    onBack: () -> Unit
) {
    val items = listOf(
        SosialisasiRecap("Edukasi Dapur Aman MBG", "08 Jun 2026", "Kelurahan Rasingae", 45),
        SosialisasiRecap("Sosialisasi TK Imam Syafi'i", "02 Jun 2026", "TK Imam Syafi'i", 60),
        SosialisasiRecap("Kolaborasi PT. FIF Group", "28 Mei 2026", "Kantor FIF Group Bima", 25)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pemberdayaan Warga", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBlue,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Text(
                "Edukasi Keselamatan Masyarakat",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(items) { recap ->
                    SocializationCard(recap)
                }
            }
        }
    }
}

@Composable
fun SocializationCard(recap: SosialisasiRecap) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = recap.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = FireRed
            )
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    Text("Tanggal: \${recap.date}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    Text("Lokasi: \${recap.location}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.PeopleOutline,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = DarkBlue
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        "\${recap.participants} Warga",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}`
  },
  pembinaan: {
    title: "PembinaanAparaturScreen.kt",
    desc: "Lists internal education modules details, teaching ASN BerAKHLAK work values and Target SKP alignment specifically.",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.BookOpen
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PembinaanAparaturScreen(
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pembinaan Aparatur", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBlue,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Aparatur Profesional & Berintegritas",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
            
            item {
                MaterialCard(
                    title = "Penerapan Core Values BerAKHLAK",
                    description = "Panduan nilai Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif di lingkungan Damkarmat.",
                    bulletPoints = listOf(
                        "Berorientasi Pelayanan: Cepat tanggap merespon bencana",
                        "Akuntabel: Transparansi data sarpras & inspeksi",
                        "Kompeten: Pelatihan sertifikasi pemadaman api",
                        "Harmonis: Solidaritas tinggi antar tim regu",
                        "Loyal: Siap siaga menjaga keselamatan warga 24/7",
                        "Adaptif: Menggunakan aplikasi digital pelaporan",
                        "Kolaboratif: Kerjasama dengan REDKAR dan relawan"
                    )
                )
            }

            item {
                MaterialCard(
                    title = "Target SKP (Sasaran Kinerja Pegawai)",
                    description = "Indikator Kinerja Utama (IKU) pengawasan sarana penyelamatan gedung dan pemenuhan Standar Pelayanan Minimal (SPM).",
                    bulletPoints = listOf(
                        "Respon Time: Di bawah 15 menit mencapai lokasi kebakaran",
                        "Rasio Inspeksi: 100% gedung publik terinspeksi pertahun",
                        "Sosialisasi: Minimal 2 kali edukasi per-bulan tiap kelurahan",
                        "Penyusunan Laporan reguler proteksi aktif pasar & niaga"
                    )
                )
            }
        }
    }
}

@Composable
fun MaterialCard(
    title: String,
    description: String,
    bulletPoints: List<String>
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = FireRed
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(12.dp))
            
            bulletPoints.forEach { point ->
                Row(modifier = Modifier.padding(vertical = 4.dp)) {
                    Text("• ", fontWeight = FontWeight.Bold, color = DarkBlue)
                    Text(point, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}`
  },
  redkar: {
    title: "RedkarScreen.kt",
    desc: "A volunteer engagement portal that features volunteer lists and a standard form to sign up as a firefighting volunteer (REDKAR).",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class Volunteer(val name: String, val subdistrict: String, val status: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RedkarScreen(onBack: () -> Unit) {
    val volunteers = listOf(
        Volunteer("Ahmad Rifai", "Asakota", "Aktif"),
        Volunteer("Siti Rahmah", "Raba", "Siaga"),
        Volunteer("Budi Santoso", "Rasanae Barat", "Pelatihan")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Relawan REDKAR Bima", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBlue, titleContentColor = Color.White)
            )
        }
    ) { paddingValues ->
        Column(modifier = Modifier.padding(paddingValues).padding(16.dp)) {
            Text("Relawan Pemadam Kebakaran Aktif", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn {
                items(volunteers) { v ->
                    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text(v.name, fontWeight = FontWeight.Bold)
                                Text("Wilayah: \${v.subdistrict}", style = MaterialTheme.typography.bodySmall)
                            }
                            Badge { Text(v.status) }
                        }
                    }
                }
            }
        }
    }
}`
  },
  nspm: {
    title: "NspmScreen.kt",
    desc: "Provides reference documents covering Norms, Standards, Procedures, and Manuals for fire prevention and containment compliance.",
    code: `package id.go.kotabima.damkarmat.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Description
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class Doc(val code: String, val title: String, val category: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NspmScreen(onBack: () -> Unit) {
    val docs = listOf(
        Doc("NSPM-01", "Standar Hidran Kebakaran Kota", "Standar"),
        Doc("NSPM-02", "Prosedur Evakuasi Pasar Tradisional", "Prosedur"),
        Doc("NSPM-03", "Manual Pemeliharaan APAR Gedung", "Manual")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("NSPM Damkarmat", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBlue, titleContentColor = Color.White)
            )
        }
    ) { paddingValues ->
        Column(modifier = Modifier.padding(paddingValues).padding(16.dp)) {
            Text("Norma, Standar, Prosedur, dan Manual", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn {
                items(docs) { d ->
                    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Row(modifier = Modifier.padding(16.dp)) {
                            Icon(Icons.Default.Description, contentDescription = "Doc", tint = FireRed)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(d.title, fontWeight = FontWeight.Bold)
                                Text("\${d.code} • \${d.category}", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
            }
        }
    }
}`
  }
};
