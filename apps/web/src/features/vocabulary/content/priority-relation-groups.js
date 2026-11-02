// Reviewed against the meanings of all 2,000 supplied cards. Selectors include
// qualifiers where the list contains distinct homographs. Groups are direct:
// membership never spreads transitively through a word's other senses.
const source = `
meaning | Hủy bỏ quyết định | abolish, cancellation, overturn
meaning | Loại bỏ | eliminate, discard, dispose, dump, scrap, shed, removal
meaning | Xóa bỏ | delete, wipe
meaning | Thiếu hụt | deficiency, deficit, shortage
family | Vắng mặt | absence, absent
contrast | Đủ và không đủ | adequate, sufficient / insufficient, inadequate
topic | Hấp thụ và lượng nạp | absorb, intake
topic | Trừu tượng và lý thuyết | abstract, theoretical
meaning | Phi lý, vô lý | absurd, ridiculous, nonsense
topic | Bạo hành và quấy rối | abuse, harassment, torture
meaning | Tăng nhanh | accelerate, escalate, soar, surge
topic | Giọng nói và phát âm | accent, articulate, verbal, oral
meaning | Chấp thuận | acceptance, consent, sanction, endorsement
meaning | Tiếp cận thuận tiện | accessible, handy
topic | Phụ kiện và thiết bị | accessory, attachment, kit, equip
meaning | Ngẫu nhiên | accidentally, random, casual
meaning | Đáp ứng yêu cầu | accommodate, cater, fulfill
topic | Chỗ ở | accommodation, residence, residential, cabin, suite
meaning | Hoàn thành, thực hiện | accomplish, fulfill, implement, execute
family | Thành tựu | accomplish, accomplishment
family | Thực hiện và triển khai | implement, implementation
meaning | Đạt được | accomplish, attain
meaning | Do đó, nhờ đó | accordingly, consequently, hence, thereby, whereby
family | Trách nhiệm giải trình | accountability, accountable
topic | Nghề kế toán và kiểm toán | accountant, audit, inventory
family | Tích lũy | accumulate, accumulation
meaning | Tập hợp | assemble, compile, gathering, accumulation
meaning | Chính xác | accuracy, accurately, precise, precisely, precision
meaning | Cáo buộc | accusation, allegation, indictment
topic | Cáo buộc và người bị buộc tội | allegation, allege, allegedly, accused
topic | Axit và hợp chất | acid, compound, organic
meaning | Thu nhận | acquisition, attain, derive
topic | Đơn vị diện tích và chiều dài | acre, width, dimension
topic | Kích hoạt | activate, activation, trigger
topic | Nhà hoạt động và vận động | activist, feminist
contrast | Cấp tính và mãn tính | acute, chronic
meaning | Thích nghi, điều chỉnh | adaptation, accommodate, adjust, adjustment
topic | Nghiện và lệ thuộc | addiction, dependence, tobacco
meaning | Ngoài ra, hơn nữa | additionally, besides, moreover
meaning | Tuân thủ | adhere, comply, compliance
meaning | Gần, bên cạnh | adjacent, alongside, beside, nearby, neighboring
meaning | Điều chỉnh, sửa đổi | adjust, adjustment, regulate, modification, amend, amendment
meaning | Quản lý và giám sát | administer, oversee, supervise, supervision, governance
family | Hành chính và quản trị | administrative, administrator, administer
topic | Nhập học và ghi danh | admission, enroll, registration, applicant
meaning | Thanh thiếu niên | adolescent, teen
topic | Nhận nuôi và nuôi dưỡng | adoption, foster, parental
meaning | Gây hại | adverse, damaging, destructive
meaning | Ủng hộ, hậu thuẫn | advocate, backing, endorse, endorsement, supportive, uphold
topic | Thẩm mỹ và tác phẩm nghệ thuật | aesthetic, artwork, sketch
meaning | Tình cảm, gắn bó | affection, fond, beloved, attachment, sentiment
meaning | Giá phải chăng | affordable, moderate
contrast | Chi phí thấp và cao | affordable, costly
meaning | Hậu quả | aftermath, sequel
topic | Tuổi tác và trưởng thành | aged, adolescent, teen, mature
topic | Xâm lược | aggression, invade, invasion
family | Nông nghiệp | agricultural, agriculture
topic | Trồng trọt | agriculture, cultivate, harvest, wheat
topic | Trợ lý và cấp phó | aide, deputy
meaning | Cảnh giác, thận trọng | alert, caution, cautious, discretion
topic | Thuật toán và lập trình | algorithm, programming, processor, processing
meaning | Ngoại lai | alien, exotic
family | Căn chỉnh | align, alignment
meaning | Giống nhau | alike, comparable, resemble, identical
topic | Kỷ lục và thành tích xuất sắc | all-time, outstanding, surpass, top
meaning | Tin chưa được xác thực | allegedly, reportedly, supposedly
topic | Đồng minh và liên minh | alliance, ally, coalition, alignment
topic | Phân bổ | allocate, allocation, assign
topic | Khoản trợ cấp | allowance, subsidy, welfare
meaning | Hoàn toàn | altogether, purely, sheer, stark, utterly, wholly
topic | Kim loại | aluminum, copper, nickel
contrast | Người mới và chuyên gia | amateur, rookie / skilled, expertise
topic | Ngoại giao | ambassador, diplomat, diplomatic, embassy
topic | Tham vọng và khát vọng | ambitious, aspiration, aspire
topic | Cấp cứu | ambulance, healthcare, trauma
meaning | Ở giữa | amid, midst
meaning | Hài hước | amusing, comic, hilarious
meaning | Thú vị, giải trí | amusing, enjoyable, entertaining
topic | So sánh và suy luận tương tự | analogy, comparative, comparable
topic | Phân tích dữ liệu | analyst, analytics, statistical
topic | Gia đình và dòng dõi | ancestor, descent, inherit, heritage
meaning | Phát thanh viên | anchor, broadcaster
topic | Nhân vật siêu nhiên | angel, demon, devil
topic | Hoạt hình và đồ họa | animation, graphic, graphics
topic | Chu kỳ thời gian | annually, monthly, weekly, seasonal
topic | Ẩn danh và nhận dạng | anonymous, identification, id
meaning | Dự đoán | anticipate, forecast, projection, predictable
meaning | Lo âu, đau khổ | anxiety, distress, troubled
topic | Xin lỗi và biết ơn | apology, appreciation, thankfully
meaning | Trang phục | apparel, outfit
meaning | Lôi cuốn | appealing, engaging, intriguing, magnetic, charming
topic | Thèm ăn và dinh dưỡng | appetite, hunger, nutrition
topic | Hoan nghênh | applaud, cheer, hail
topic | Thích hợp và liên quan | applicable, relevance, irrelevant, inappropriate
meaning | Chỉ định, bổ nhiệm | appoint, designate, nominate
topic | Kiến trúc và xây dựng | architectural, structural, erect, brick, foundation
topic | Lưu trữ tài liệu | archive, storage, documentation
topic | Sân khấu và biểu diễn | arena, spectacle, spectator
topic | Vũ khí | arm, firearm, rifle, sword
topic | Cấu trúc dữ liệu | array, database, index
topic | Chỉ hướng | arrow, marker, indication, indicator
meaning | Truyền đạt, diễn đạt | articulate, convey, formulate
topic | Cháy và phần còn lại | ash, debris, remains
topic | Ám sát và giết người | assassination, homicide, massacre, genocide
topic | Tấn công và bạo lực | assault, rape, stab
topic | Hội nghị và hội thảo | assembly, convention, seminar, forum
meaning | Khẳng định, tuyên bố | assert, assertion, proclaim, declaration
topic | Lợi ích và giá trị | asset, beneficial, merit, virtue
meaning | Giúp đỡ | assistance, facilitate, oblige
meaning | Giả định, suy đoán | assumption, hypothesis, presume, speculation
meaning | Bảo đảm, cam kết | assurance, assure, pledge, undertake, warrant
meaning | Gây sửng sốt | astonishing, stun, stunning, shocking
topic | Nơi trú ẩn và tị nạn | asylum, refuge, refugee
topic | Thể thao và tập luyện | athletic, workout, marathon
topic | Tham dự và số người tham dự | attendance, turnout, participation
meaning | Đặc điểm | attribute, trait, characterize, distinctive
topic | Đấu giá và trả giá | auction, bid
meaning | Kiểm tra | audit, inspect, inspection, testing
contrast | Thật và giả | authentic, genuine / fake, forge
meaning | Trao quyền | authorize, empower
topic | Xe đường bộ | auto, pickup, carriage, trailer
topic | Tự do và chủ quyền | autonomy, liberty, independence, sovereignty
topic | Mùa và thời tiết | autumn, seasonal, warming
topic | Khả dụng và tính hữu dụng | availability, accessible, utility, functional
topic | Chờ đợi và thời điểm sắp tới | await, forthcoming, upcoming, imminent
meaning | Nhận thức | awareness, cognitive, perceive, realization, consciousness, perception
meaning | Bối rối, lúng túng | awkward, confusion, embarrassment, puzzle
topic | Bối cảnh và phạm vi | backdrop, canvas, scope
topic | Thay thế và dự bị | backup, replacement, substitute, substitution, successor
topic | Huy hiệu và giải thưởng | badge, medal, trophy
topic | Tại ngoại và giam giữ | bail, custody, detention
topic | Cân bằng và ổn định | balanced, stability, stabilize
topic | Nghệ thuật biểu diễn | ballet, opera, orchestra, choir
topic | Khí cầu và bay | balloon, jet, drone
topic | Bỏ phiếu và bầu cử | ballot, electoral, voting, poll, referendum
meaning | Tiếng nổ | bang, blast, pop
topic | Phá sản | bankruptcy, ruin, smash
topic | Biểu ngữ và khẩu hiệu | banner, slogan, propaganda
meaning | Trần trụi | bare, naked
topic | Mức độ và giới hạn | barely, marginal, minimal, lesser
topic | Thỏa thuận và nhượng bộ | bargain, compromise, concession, negotiate, negotiation
topic | Đồ chứa | barrel, basket, vessel, packet
topic | Không gian trong nhà | basement, interior, corridor, lobby
topic | Nhạc cụ và âm nhạc | bass, instrumental, melody, orchestra
topic | Bóng chày | bat, blast, lineup
topic | Chiến trường | battlefield, combat, warfare
topic | Địa hình ven biển | bay, coastal, shore, cliff
topic | Tia sáng | beam, ray, lighting, optical
topic | Động vật | beast, breed, predator, prey
topic | Đại diện | behalf, representation, delegate, delegation
topic | Ghế và đồ nội thất | bench, cabinet
meaning | Chuẩn mực | benchmark, norm
meaning | Bên dưới | beneath, underlying
topic | Người hưởng lợi và người đóng góp | beneficiary, donor, contributor
topic | Đồ uống | beverage, cocktail, sake
meaning | Thiên vị, định kiến | bias, partial, prejudice, stereotype
topic | Giàu có và thịnh vượng | billionaire, prosperity, enrich, golden
meaning | Liên kết và hợp nhất | bind, joint, merge, unify, unite
family | Ràng buộc | bind, bound
topic | Tiểu sử và hồi ký | biography, memoir, historian
topic | Sinh học và di truyền | biological, gene, genetic, hybrid
topic | Giáo sĩ | bishop, pastor
meaning | Kỳ lạ | bizarre, weird, exotic
topic | Dụng cụ sắc | blade, sword, chop, slash
topic | Vải và đồ dệt | blanket, fabric, fiber, weave, thread
topic | Chảy máu và mạch máu | bleed, vein, pulse
meaning | Pha trộn và phối hợp | blend, merge, coordinate, coordination
topic | Chúc phúc | bless, blessing, sacred
meaning | Cú đánh và cú đấm | blow, punch, slap, slam
contrast | Khoe khoang và khiêm tốn | boast / humble, modest
topic | Can đảm và dám làm | bold, dare, venture
meaning | Củng cố, tăng cường | bolster, consolidate, reinforce, strengthen
topic | Nổ và chất nổ | bombing, blast, explosive, firework
topic | Tiền thưởng và khích lệ | bonus, incentive, premium
topic | Đặt lịch và hạn chót | booking, deadline, slot
contrast | Bùng nổ và suy thoái kinh tế | boom / recession, depression
meaning | Thúc đẩy | boost, stimulate, foster, facilitate
topic | Chuyển động bật, nảy | bounce, burst, snap
topic | Ranh giới và ngưỡng | boundary, threshold, margin
topic | Trận đấu và giải đấu | bout, championship, tournament
topic | Cúi chào và cử chỉ | bow, nod, gesture
topic | Điều khiển xe | brake, gear, steer
topic | Vi phạm | breach, violate, violation
meaning | Vết nứt, khiếm khuyết | crack, flaw, defect, flawed
topic | Hỏng hóc và suy yếu | breakdown, deteriorate, weaken
topic | Đột phá và đổi mới | breakthrough, revolutionary, innovation, innovative
topic | Nhân giống và sinh sản | breed, reproduce, hybrid
topic | Ngắn và tạm thời | briefly, interim, short-term, temporarily
topic | Internet | broadband, browser, connectivity
meaning | Khái quát | broadly, generic
meaning | Tàn bạo | brutal, vicious, harsh
topic | Tiền và mệnh giá | buck, dime, nickel
meaning | Bạn bè, đồng hành | buddy, companion, mate
topic | Dự phòng và giảm tác động | buffer, backup, mitigate
topic | Côn trùng và sinh vật nhỏ | bug, mosquito, worm
meaning | To lớn | bulk, immense, tremendous, large-scale
topic | Gói và bó | bundle, packet, chunk
topic | Gánh nặng và áp lực | burden, strain
topic | Tang lễ và chôn cất | burial, cemetery, funeral, grave (for dead person)
topic | Âm thanh | buzz, echo, horn, whisper, yell
topic | Tính toán | calculation, reckon, mathematical
topic | Dòng nước và công trình nước | canal, dam, drain, pump
topic | Nến và chiếu sáng | candle, lighting, spotlight
meaning | Năng lực | capability, competence, faculty
topic | Chuyên môn và năng lực | competence, competent, expertise, skilled
family | Chủ nghĩa tư bản | capitalism, capitalist
topic | Hàng hóa và vận chuyển | cargo, commodity, shipping, transit
topic | Chạm khắc và thủ công | carve, craft, artwork
topic | Cờ bạc | casino, gambling, gaming, lottery, stake
topic | Tòa nhà và nơi chốn | castle, kingdom
topic | Thương vong và tử vong | casualty, fatal, lethal, deadly
topic | Danh mục và danh sách | catalog, listing, roster, portfolio
topic | Chăn nuôi và động vật có vú | cattle, wolf, beast
topic | Hang và hốc | cave, pit, niche
meaning | Chấm dứt | cease, halt, terminate, closure
contrast | Chắc chắn và không chắc | certainty, inevitable, undoubtedly / uncertainty
topic | Giấy tờ chứng nhận | certificate, identification, visa
meaning | Khó khăn, thách thức | challenging, problematic, dilemma
topic | Buồng và khoang | chamber, cabin, suite
meaning | Hỗn loạn | chaos, confusion, disorder, disruption
topic | Duyên dáng và thanh lịch | charm, charming, grace, elegant
topic | Hiến chương và hiến pháp | charter, constitution, constitutional, unconstitutional
topic | Truy đuổi | chase, pursuit, trail, trace
topic | Khuôn mặt | cheek, skull, temple
topic | Cổ vũ và động viên | cheer, encouragement, encouraging, motivate
topic | Lạnh và nhiệt | chill, warming, steam
topic | Dòng điện và mạch | circuit, electronics, tension
family | Lưu hành và tuần hoàn | circulate, circulation
meaning | Phổ biến, lan rộng | circulate, prevail, prevalence, widespread, universal
topic | Công dân và quyền công dân | citizenship, civic, civilian, franchise
topic | Văn minh và xã hội | civilization, humanity
topic | Giải thích | clarify, interpretation, clarity
meaning | Rõ ràng | clarity, explicit, evident, pronounced, straightforward
meaning | Xung đột, đối đầu | clash, confrontation, confront, combat
topic | Phân loại | classification, classify, systematic
meaning | Bám, giữ chặt | cling, adhere, grip, grasp
topic | Cơ sở và nhân viên y tế | clinic, healthcare, physician, practitioner
topic | Y khoa lâm sàng | clinical, diagnosis, diagnose, syndrome
topic | Kẹp và gắn | clip, bind, hook
topic | Cụm và nhóm | cluster, array, collective
topic | Đồng thời và trùng hợp | coincide, coincidence, simultaneously, parallel
meaning | Hợp tác | collaborate, collaboration, cooperate, cooperation, cooperative
topic | Điều phối | coordinate, coordination, coordinator
topic | Sưu tập và thu gom | collector, gathering, retrieve
topic | Va chạm | collision, clash, blow
topic | Thuộc địa và đế quốc | colony, empire
meaning | Rực rỡ, sống động | colorful, vibrant
topic | Báo chí và bình luận | columnist, journalism, commentary, commentator, editorial
topic | Trở lại | comeback, revival, revive
topic | Diễn hài | comedian, comic, hilarious
meaning | Khởi đầu | commence, initiate, debut, originate
topic | Chú thích và ghi chép | caption, commentary, memo, transcript
meaning | Buôn bán | commerce, trading, transaction
topic | Thị trường và thương mại điện tử | marketplace, commerce, e-commerce
topic | Chức vụ hội đồng | commissioner, councilor, trustee
topic | Các hệ tư tưởng | communist, socialist, capitalist, liberal
meaning | Thương cảm | compassion, mercy, pity, sympathetic
meaning | Ép buộc | compel, compulsory, mandatory, oblige, enforce
meaning | Có sức thuyết phục | compelling, convincing
meaning | Bù đắp, bồi thường | compensate, compensation, offset, refund
topic | Soạn nhạc | compose, composer, composition, melody
meaning | Bổ sung | complement, supplement
topic | Hoàn thành và thi hành | completion, accomplish, discharge, execute
meaning | Phức tạp, tinh vi | complexity, elaborate, sophisticated
topic | Biến chứng và bệnh trạng | complication, disorder, syndrome
meaning | Toàn diện | comprehensive, extensive, inclusive
meaning | Bao gồm | comprise, encompass, inclusion, incorporate, inclusive
meaning | Che giấu | conceal, hidden, screening
meaning | Thừa nhận, thú nhận | concede, confess, admission, confession
topic | Thai kỳ và sinh con | conceive, pregnancy, abortion, infant
contrast | Trừu tượng và cụ thể | concrete, abstract
meaning | Hữu hình, có thực | concrete, substantial
meaning | Lên án, kết án | condemn, denounce, convict, conviction
topic | Cấu hình và thiết lập | configuration, setup, layout, installation
meaning | Giam giữ | confine, detain, incarcerate, jail, custody, detention, incarceration
meaning | Xác nhận, chứng thực | confirmation, verify, endorse, testimony
topic | Đối phó và giải quyết | confront, cope, tackle, settlement
topic | Chúc mừng và vinh quang | congratulate, glory, glorious, triumph
topic | Cộng đoàn tôn giáo | congregation, worship, ritual
topic | Quốc hội và lập pháp | congressional, parliament, legislative, legislature, lawmaker
topic | Chinh phục và thắng lợi | conquer, overcome, triumph
topic | Lương tâm và đạo đức | conscience, ethic, integrity, virtue
meaning | Liên tiếp | consecutive, serial, successive, succession
meaning | Đồng thuận và đoàn kết | consensus, solidarity, unity
meaning | Bảo tồn | conservation, conserve, preservation, safeguard
family | Bền vững | sustain, sustainability, sustainable
meaning | Đáng kể | considerable, considerably, substantial, substantially
family | Nhất quán | consistency, consistently
topic | Máy chơi game và trò chơi | console, gaming
topic | Âm mưu và gián điệp | conspiracy, spy, insider
topic | Cấu thành và cấu trúc | constitute, composition, structural, framework
meaning | Hạn chế, ràng buộc | constraint, limitation, restraint, restrict, restriction
family | Tham khảo và tư vấn | consult, consultation, consultant
topic | Chuyên gia tư vấn | consultant, counselor, counseling, mentor
topic | Tiêu dùng và chi tiêu | consumption, expenditure, intake
meaning | Suy ngẫm | contemplate, reflection, meditation, speculate
topic | Khinh miệt và xúc phạm | contempt, insult, outrage
meaning | Tranh luận | contend, contention, controversy, controversial, disagreement, dispute
meaning | Đối thủ | contender, rival
topic | Hài lòng và vui mừng | content, satisfaction, delighted, thrilled
topic | Liên tục và kéo dài | continually, ongoing, endless, persistent, linger
topic | Xây dựng và nhà thầu | contractor, erect, rebuild
topic | Tương phản | contrary, counter (argue against), versus
topic | Tiện lợi và tiện dụng | convenience, handy, functional, utility
topic | Quy ước và tập quán | convention, conventional, usage
meaning | Biến đổi | conversion, transformation, variation, modification
topic | Chuyển đổi toán học | conversion, equation, variable, parameter
topic | Truy tố và xét xử | prosecute, prosecution, prosecutor, proceeding, judicial, jury
topic | Cảnh sát và tuần tra | cop, patrol, surveillance
topic | Công ty và doanh nghiệp | corporation, enterprise, entity, start-up, entrepreneur
topic | Sửa chữa và hiệu chỉnh | correction, amend, amendment, revision
family | Tương quan | correlate, correlation
meaning | Tương ứng | correspond, corresponding, equivalent, respective, respectively
topic | Phóng viên và đưa tin | correspondent, reporting, broadcaster
family | Tham nhũng | corrupt, corruption
topic | Đồ chứa và đồ gốm | vessel, barrel, basket
topic | Bắt chước và sao chép | reproduce, simulation, counterpart
meaning | Vô số | countless, endless
topic | Đảo chính và nổi dậy | coup, rebellion, rebel, riot
topic | Lịch sự và hiếu khách | courtesy, hospitality, grace
topic | Phạm vi bao phủ | coverage, scope, domain, realm
topic | Cao bồi và vùng đất | cowboy, homeland, territory
meaning | Bò, trườn | crawl, creep
topic | Sáng tạo | creativity, creator, innovation, innovative, inspiration
topic | Độ tin cậy | credibility, credible, reliability
topic | Phê bình | critically, critique, denounce
topic | Vương quyền | crown, kingdom, reign
topic | Thô sơ và tinh xảo | crude, sophisticated, delicate
topic | Du ngoạn và đi chơi | cruise, outing, expedition
meaning | Đè, ép | crush, squeeze, grind
topic | Tiền mã hóa | cryptocurrency, transaction
topic | Tinh thể và vật liệu | crystal, compound
topic | Dấu hiệu, tín hiệu | cue, hint, indication, indicator
topic | Tín ngưỡng và giáo phái | cult, doctrine, ritual, worship
topic | Tò mò | curiosity, curious, intriguing
topic | Giáo dục và giảng dạy | curriculum, educator, textbook, literacy
topic | Đáng yêu và yêu quý | cute, beloved
topic | Sữa và dinh dưỡng | dairy, nutrition, protein
contrast | Bóng tối và ánh sáng | darkness / lighting, dawn
topic | Tử vong và chất độc | deadly, fatal, lethal, toxic
topic | Nhà buôn và đại lý | dealer, merchant, outlet
meaning | Quyết đoán | decisive, firm, firmly, determination
topic | Bộ bài và trò bài | deck, patience
topic | Cống hiến | dedicated, dedication, devote
topic | Hành động và động cơ | deed, intent, motive
meaning | Cho rằng | deem, presume
topic | Mặc định và chế độ | default, mode
topic | Bảo vệ và phòng thủ | defender, defensive, protective, safeguard
meaning | Chống lại | defy, counter (argue against), combat, resistance
topic | Đại biểu | delegate, delegation, representation
topic | Tinh tế và tế nhị | delicate, subtle, sensitivity
family | Dân chủ | democracy, democratic
topic | Biểu tình và tuần hành | demonstration, protester, march, rally
meaning | Từ chối, phủ nhận | denial, refusal, rejection
family | Mật độ | dense, density
topic | Rời đi và rút lui | depart, withdraw, retreat
family | Phụ thuộc | dependence, dependent
meaning | Mô tả, khắc họa | depict, portray, characterize
family | Triển khai | deploy, deployment
topic | Gửi tiền và khoản đặt cọc | deposit, mortgage, rental
topic | Trầm buồn và đau khổ | depression, grief, misery, miserable, suffering
topic | Tước đoạt | deprive, seize, strip (remove clothes/a layer)
meaning | Bắt nguồn từ | derive, originate, stem
topic | Đi xuống | descend, descent, plunge
topic | Mong muốn và sự sẵn lòng | desirable, eager, willingness, preference
topic | Máy tính và giao diện | desktop, notebook, interface, hardware
topic | Tuyệt vọng và thất vọng | desperately, disappoint, disappointment, frustrated
topic | Phá hủy | destruction, destructive, devastate, devastating
topic | Phát hiện và dò tìm | detection, sensor, radar, probe
meaning | Tệ đi, suy yếu | deteriorate, undermine, weaken
topic | Dự định và kế hoạch | devise, formulate, intent
topic | Bệnh mạn tính | diabetes, chronic, obesity
family | Chẩn đoán | diagnose, diagnosis
topic | Ra lệnh và chỉ thị | dictate, mandate, instruct
topic | Khác biệt | differ, differentiate, distinct, distinction, distinguish
topic | Phẩm giá và tự trọng | dignity, pride, integrity
topic | Chiều và phương hướng | dimension, vertical, linear, parallel
meaning | Giảm bớt | diminish, shrink, minimize, mitigate, slash
topic | Nhúng và ngâm | dip, soak, embed
family | Khuyết tật | disability, disabled
topic | Thất vọng | disappoint, disappointment, frustrated, frustrating, frustration
meaning | Thảm khốc | disastrous, devastating, tragic
topic | Tiết lộ | disclose, disclosure, revelation, unveil
topic | Lộ thông tin | leak, disclose, exposure
topic | Làm nản lòng | discourage, chill, frustration
topic | Diễn thuyết và tu từ | discourse, rhetoric, articulate
topic | Phân biệt đối xử | discrimination, racism, racist
topic | Giải tán và giải thể | dismissal, dissolve, closure
topic | Di dời và thay thế | displace, removal, replacement
topic | Vứt bỏ và xử lý | disposal, dispose, discard
meaning | Làm phiền, cản trở | disrupt, disturb, interfere
meaning | Xa cách, biệt lập | distant, isolated, isolation
topic | Đặc trưng và phân biệt | distinctive, characterize, differentiate
topic | Mất tập trung và lo âu | distract, disturbing, anxiety
topic | Lặn và chết đuối | dive, drown, plunge
topic | Đa dạng | diverse, diversity, varied, variation
topic | Chuyển hướng | divert, steer, navigate
topic | Cổ phần và cổ tức | dividend, shareholder, stake
topic | Hôn nhân và ly hôn | divorce, spouse, widow, engagement
topic | Tài liệu và ghi chép | documentation, memo, transcript
topic | Chi phối và ưu thế | dominance, dominant, prevail
topic | Quyên góp và gây quỹ | donation, donor, fundraising, nonprofit
topic | Liều thuốc | dose, pill, medication, pharmaceutical
topic | Dấu chấm và dấu vết | dot, trace, footprint
topic | Kịch tính và ấn tượng | dramatically, striking, spectacular
meaning | Lang thang | drift, wander
meaning | Năng động | driving, dynamic, vibrant
topic | Thiên tai | drought, tsunami, outbreak
topic | Đôi và ba | dual, duo, trio
topic | Phim và lồng tiếng | dub, filmmaker, footage, screening
topic | Sắc và cùn | dull, blade, keen
meaning | Khoảng thời gian | duration, interval, span
topic | Thu nhập và doanh thu | earnings, revenue, proceeds, turnover
meaning | Dễ dàng, nhẹ nhõm | ease, relieve, relieved
topic | Sinh thái và môi trường | ecological, ecosystem, habitat, conservation
topic | Kinh tế học | economics, economist, fiscal, inflation, recession
topic | Hiệu quả và năng suất | effectiveness, efficiency, efficiently, productive, productivity
topic | Bản ngã và bản năng | ego, id, instinct
meaning | Cơ bản, nền tảng | elementary, essentially, underlying, foundation
meaning | Nâng lên | elevate, erect, boost
topic | Điều kiện và tiêu chuẩn | eligible, valid
topic | Giới tinh hoa và uy tín | elite, prestigious, prominent
topic | Lên tàu và hạ cánh | embark, landing, terminal
topic | Thể hiện và hiện thân | embody, manifest, render
meaning | Ôm | embrace, hug
topic | Xuất hiện và xảy ra | emergence, occurrence, unfold
topic | Phát thải và bức xạ | emission, radiation, transmission
topic | Ban hành luật | enact, legislation, legislative, provision
meaning | Nỗ lực | endeavor, strive, pursuit
family | Thi hành và cưỡng chế | enforce, enforcement
topic | Người hâm mộ và người theo | enthusiast, follower, subscriber
topic | Đặt tên | entitle, designate, tag
topic | Thư từ và thông báo | envelope, newsletter, notification
topic | Dịch bệnh và lây nhiễm | epidemic, pandemic, infectious, infect, viral
meaning | Bình đẳng, công bằng | equality, equity, fairness, just
contrast | Công bằng và bất công | fairness / injustice, discrimination
topic | Thời đại và lịch sử | era, medieval, historian
topic | Phun trào và bùng phát | erupt, outbreak, explosive
topic | Bản chất và thuộc tính | essence, trait, texture
topic | Thành lập và người sáng lập | establishment, founder, start-up
topic | Dân tộc và bộ lạc | ethnic, indigenous, tribal, tribe
topic | Di tản và tị nạn | evacuate, refugee, refuge
topic | Đánh giá và xếp hạng | evaluation, rating, ranking, benchmark
meaning | Gợi lên | evoke, spark, prompt
family | Tiến hóa | evolution, evolutionary, evolve
topic | Phóng đại và quá mức | exaggerate, excess, excessive, overly
meaning | Vượt qua, vượt trội | exceed, surpass, top
meaning | Xuất sắc | excellence, exceptional, outstanding, superb, superior
topic | Tiền lệ và chưa từng có | precedent, unprecedented, exception
meaning | Dư thừa | excess, surplus, spare
family | Loại trừ | exclude, exclusion, exclusive, exclusively
meaning | Duy nhất | exclusive, exclusively, sole, solely
topic | Hành quyết và án tử | execute, execution, homicide
topic | Lưu vong và di cư | exile, migrant, migration
meaning | Mở rộng | expansion, extension, widen
meaning | Chiết xuất và lấy ra | extract, derive
topic | Cực đoan và cấp tiến | extremist, radical, militant
meaning | Tuyệt vời | fabulous, superb, terrific, super
topic | Giả mạo và gian lận | fake, forge, fraud, scam
topic | Danh tiếng | fame, renowned, legendary, prestigious
topic | Thần thoại và kỳ ảo | fantasy, myth, legend, magical
topic | Cước phí | fare, toll, tuition
topic | Số phận và may mắn | fate, fortunate, unfortunate
topic | Thuận lợi và triển vọng | favorable, promising, hopeful
topic | Tội phạm và phạm tội | felony, offender, accused, guilt
topic | Nữ quyền | feminist, equality, equity
meaning | Hung dữ, hiếu chiến | fierce, hostile, militant, vicious
topic | Lọc và phân tách | filter, isolate, separation
topic | Hình phạt | fine, penalty, sanction
topic | Cứu hỏa và cháy | firefighter, wildfire, firework
topic | Tài khóa và thuế | fiscal, levy, taxpayer
topic | Cơn bệnh và hội chứng | fit, bout, syndrome
topic | Mùi vị | flavor, spice, herb
topic | Lỗi và khiếm khuyết | flaw, flawed, defect, incorrect
topic | Bỏ chạy và di tản | flee, evacuate, depart
topic | Tàu thuyền | fleet, vessel, harbor, marine
topic | Mô và cơ thể | flesh, tissue, limb
topic | Linh hoạt và thích ứng | flexibility, adaptation, adjust
meaning | Phát triển mạnh, thịnh vượng | flourish, thrive, prosperity
topic | Chất lưu và trạng thái vật chất | fluid, steam, vacuum
topic | Tiếp nối | follow-up, sequel, subsequent, subsequently, thereafter
topic | Hút và uống | intake, suck, swallow
topic | Dấu vết và lần theo | footprint, trace, trail
meaning | Cấm | forbid, prohibit
topic | Định dạng và đặc tả | format, specification, layout
topic | Địa chất | formation, fossil, terrain
topic | Công thức và toán học | formula, equation, mathematical
topic | Trước đó và người tiền nhiệm | formerly, prior, predecessor
topic | Tiến về trước và tiến trình | forth, proceed, progressive
meaning | Sắp tới | forthcoming, upcoming, imminent
topic | Phân số và tỷ lệ | fraction, ratio, proportion, portion
meaning | Mỏng manh, dễ vỡ | fragile, delicate, vulnerable
meaning | Mảnh vụn | fragment, debris, scrap, chunk
topic | Khung và cấu trúc | framework, structural, fabric
topic | Nhượng quyền và sở hữu trí tuệ | franchise, copyright, patent, trademark
meaning | Thẳng thắn, trung thực | frankly, openly, honesty, straightforward
topic | Tự do và tự nguyện | freely, liberty, voluntary, willingness
contrast | Thường xuyên và thỉnh thoảng | frequent, occasional
topic | Sinh viên các năm | freshman, sophomore
contrast | Toàn thời gian và bán thời gian | full-time, part-time
topic | Giận dữ | furious, rage, outrage
topic | Đơn vị dung tích | gallon, liter
meaning | Nhìn thoáng qua | glance, glimpse
topic | Nhìn và quan sát | gaze, glance, glimpse, observer, scrutiny
topic | Trí tuệ và thông minh | genius, intellectual, wisdom, wit
topic | Chân thật | genuine, genuinely, honesty
topic | Biểu diễn âm nhạc | gig, solo, duo, trio
topic | Toàn cầu và địa cầu | globalization, globe, universal
family | Vinh quang | glorious, glory
topic | Phẩm chất tốt | goodness, virtue, mercy
meaning | Lộng lẫy | gorgeous, magnificent, stunning
family | Đồ họa | graphic, graphics
meaning | Hiểu và nắm bắt | grasp, interpretation, realization
topic | Nghiêm trọng | grave (serious), severely, gravity
topic | Trọng lực và động lượng | gravity, momentum, motion
topic | Rất nhiều và mức độ lớn | greatly, considerably, substantially
topic | Nhà kính và ấm lên | greenhouse, warming, ecological
topic | Lưới và mạng | grid, connectivity, circuit
topic | Nghiền và xay | grind, mill, crush
meaning | Hướng dẫn | guidance, guideline, instruct, orientation
topic | Tội lỗi và lương tâm | guilt, sin, conscience
topic | Cơ quan nội tạng | gut, liver, kidney
topic | Chặt, cắt, đẽo | hack, chop, carve, slash
topic | Đoạn đường và khoảng cách | halfway, span, pathway
topic | Dụng cụ và thao tác | hammer, screw, kit
topic | Lượng nhỏ và phần | handful, portion, fraction
topic | Quản lý và xử lý | handling, administer, processing
topic | Phần cứng và máy móc | hardware, machinery, mechanism, mechanical
topic | Hài hòa và phối hợp | harmony, coordination, mutual
topic | Thù hận và trả thù | hatred, spite, revenge
meaning | Ám ảnh | haunt, obsess, obsession
meaning | Nguy hiểm, rủi ro | hazard, risky
topic | Trụ sở và cơ quan | headquarters, ministry, institutional
meaning | Chữa lành và hồi phục | heal, recovery, rehabilitation, restore
topic | Tăng cường độ | heighten, intensify, intensity, intensive
topic | Bảo hộ và an toàn | helmet, protective, safeguard
topic | Di sản và thừa kế | heritage, legacy, inherit
topic | Thứ bậc | hierarchy, ranking, superior
meaning | Được chú ý, nổi bật | high-profile, prominent, notable, striking
topic | Tay chân và khớp | hip, elbow, joint, limb, wrist, thumb, palm
topic | Quê hương và lãnh thổ | homeland, territory, mainland
topic | Không nhà và chỗ ở | homeless, accommodation, residence
topic | Mật ong và nông sản | honey, harvest, nutrition
topic | Móc và bẫy | hook, trap, loop
topic | Hy vọng | hopeful, hopefully, optimism, optimistic
topic | Đường chân trời và cảnh nhìn | horizon, viewpoint, outlook
topic | Bắt cóc và con tin | hostage, kidnap
family | Nhân đạo và nhân loại | humanitarian, humanity
topic | Khí và nguyên tố | hydrogen, oxygen, carbon
topic | Biểu tượng | icon, logo, symbolic
topic | Bản sắc và nhận dạng | id, identification, identical
topic | Hệ tư tưởng | ideology, doctrine, mindset
contrast | Hiểu biết và thiếu hiểu biết | ignorance / wisdom, literacy
topic | Ảo tưởng và hình dung | illusion, imagery, fantasy
topic | Nhập cư và di cư | immigration, migrant, migration
family | Miễn dịch | immune, immunity
topic | Hàm ý và ám chỉ | implication, hint, infer
contrast | Năng lực và bất lực | capability / inability, inadequate
topic | Đầu vào và đầu ra | input, output
topic | Điều tra và người điều tra | inquire, probe, investigator
meaning | Tìm hiểu, điều tra | inquire, probe
topic | Đưa vào và chèn | inject, injection, insert, embed
contrast | Người trong và ngoài cuộc | insider, outsider
family | Kiểm tra và thanh tra | inspect, inspection, inspector
topic | Cài đặt và nâng cấp | installation, upgrade, module
meaning | Tức thì | instant, instantly, readily
meaning | Cấp bách | instant, urgent
topic | Toàn vẹn | intact, integrity, unity
family | Tích hợp, hòa nhập | integrate, integrated, integration
topic | Tích phân và toán tử | integral, integration, operator
topic | Ý định và động cơ | intent, motive, motivation
family | Tương tác | interact, interaction, interactive
topic | Can thiệp | interfere, interference, intervene, intervention
topic | Giao lộ và làn đường | intersection, lane, sidewalk
topic | Thân thiết và gắn bó | intimate, affection, attachment
topic | Đầu tư | investor, venture, portfolio, shareholder
meaning | Cầu xin | invoke, petition, plea, plead
topic | Tham gia | involvement, participation, engagement
topic | Mỉa mai và lời nói | ironically, rhetoric, critically
family | Cô lập và cách ly | isolate, isolated, isolation
topic | Nhà tù và tù nhân | jail, inmate, incarceration
topic | Tư pháp và xét xử | judicial, jurisdiction, jury, verdict, ruling
topic | Biện hộ | justification, plead, defensive, advocate
topic | Trường mầm non | kindergarten, nursery
topic | Leo và lên xuống | ladder, descend, elevate
topic | Chủ nhà và người thuê | landlord, tenant, rental
topic | Mốc và bước ngoặt | landmark, benchmark, breakthrough
topic | Lòng và bộ phận cơ thể | lap, palm, hip
meaning | Gần đây | lately, newly, latter
topic | Kiện tụng | lawsuit, sue, proceeding
topic | Bước tiến và thành tựu | leap, accomplishment, breakthrough
family | Truyền thuyết | legend, legendary
topic | Hợp pháp và quy định | legitimate, legislation, regulatory, valid
topic | Kéo dài | lengthy, linger, endless, duration
topic | Quang học | lens, laser, optical, spectrum, reflection
topic | Giới và xu hướng tính dục | lesbian, trans, sexuality
topic | Trách nhiệm pháp lý | liable, accountable, accountability
topic | Suốt đời | lifelong, lifetime, permanently
meaning | Khả năng, xác suất | likelihood, odds, probability, probable
meaning | Tương tự như vậy | likewise, alike
topic | Chủ yếu và chính | predominantly, primarily, principal, mainstream
topic | Danh sách và nhân sự | listing, roster, personnel
topic | Văn học | literary, novelist, verse, lyric
topic | Rác và vật bỏ đi | litter, scrap, disposal
topic | Logic và suy luận | logic, reasoning, rational, infer
meaning | Lâu năm | long-standing, longtime, lifelong
topic | Đe dọa và nguy hiểm cận kề | loom, imminent, hazard
family | Trung thành | loyal, loyalty
topic | Phép thuật và thần kỳ | magical, spell, miracle
meaning | To lớn và quy mô | magnitude, immense, large-scale, tremendous
topic | Bảo trì và phục hồi | maintenance, rebuild, reconstruction
topic | Trang điểm và diện mạo | makeup, aesthetic, gorgeous
topic | Sản xuất, chế tạo | making, manufacture, manufacturing
topic | Điều khiển và thao tác | manipulate, manipulation, handling
topic | Hàng hải | marine, navigation, navigate, harbor
topic | Rìa và đường biên | margin, marginal, boundary
topic | Mặt nạ và che giấu | mask, conceal, hidden
topic | Thợ và nghề nghiệp | mechanic, miner, practitioner, occupation
topic | Điều trị và thuốc | medication, remedy, therapist, pharmaceutical
topic | Thiền và suy ngẫm | meditation, contemplate, reflection
topic | Thành viên và đăng ký | membership, subscribe, subscriber, subscription
topic | Đáng nhớ và kỷ niệm | memorable, memorial, monument, reminder
meaning | Chỉ, đơn thuần | mere, merely, solely
family | Sáp nhập | merge, merger
topic | Phép ẩn dụ và tu từ | metaphor, rhetoric, analogy
topic | Phương pháp và nghiên cứu | methodology, systematic, experimental
topic | Dân quân và quân đội | militia, troop, warrior, commander
topic | Khai thác mỏ | miner, mining, pit
topic | Rất nhỏ và tối thiểu | minimal, minute, lesser
topic | Quái vật và phản diện | monster, villain, devil
topic | Lừa dối và gây hiểu lầm | misleading, fraud, scam
topic | Tên lửa | missile, rocket, jet
topic | Đám đông và bạo loạn | mob, riot, rally
family | Di động | mobile, mobility, mobilize
topic | Tối đa và tối thiểu | maximize, minimize, minimal
topic | Mô-đun và thành phần | module, composition
topic | Độc quyền | monopoly, exclusive, copyright
topic | Nhà thờ và đền | mosque, temple, sacred
topic | Chuyển động | motion, moving, momentum, rotation
topic | Đô thị và ngoại ô | municipal, suburb, suburban, civic
meaning | Chung, qua lại | mutual, joint, collective
topic | Có nghĩa và vô nghĩa | meaningful, significance, nonsense
topic | Thô tục và khó chịu | nasty, harsh, crude
topic | Phạm vi quốc gia | nationwide, province, provincial
topic | Gọi tên cụ thể | namely, specify, designate
topic | Điều hướng | navigate, navigation, steer
topic | Cần thiết và bắt buộc | necessity, mandatory, compulsory
topic | Bỏ bê, bỏ qua | neglect, overlook, skip
topic | Tổ và nơi sống | nest, habitat, colony
topic | Tổng và ròng | net, gross, earnings
topic | Trung lập và khách quan | neutral, fairness, clinical
topic | Ngách và chuyên môn | niche, specialize, specialized
family | Đề cử | nominate, nomination, nominee
topic | Tương phản và nhượng bộ | nonetheless, regardless, contrary
topic | Các thời điểm trong ngày | noon, dawn, overnight
meaning | Đáng chú ý | notable, notably, remarkable, prominent
topic | Thông báo và lời nhắc | notification, notify, reminder, memo
meaning | Khét tiếng | notorious, infamous
meaning | Mới lạ, đổi mới | novel, innovative, innovation
meaning | Hiện nay | nowadays, presently
topic | Điều dưỡng và chăm sóc | nursing, healthcare, parental
topic | Dinh dưỡng và ăn uống | nutrition, obesity, protein, vegan
topic | Phản đối | objection, dispute, counter (argue against)
topic | Ám ảnh | obsess, obsession, haunt
topic | Chướng ngại và cản trở | obstacle, constraint, inhibit
topic | Cư ngụ và định cư | occupy, reside, residence, inhabitant
topic | Lễ vật và hiến tế | offering, sacrifice, ritual
topic | Ngoài khơi và ven biển | offshore, coastal, marine
topic | Vận hành | operational, functional, mechanism
topic | Lựa chọn | opt, preference, selective
topic | Lạc quan | optimism, optimistic, hopeful
topic | Tổ chức và cơ cấu | organizational, institutional, machinery, entity
topic | Viễn cảnh và triển vọng | outlook, promising, prospective, potentially
topic | Cửa hàng và quầy hàng | outlet, stall, counter (long flat surface), retail
meaning | Quá mức | overly, excessive, excess
topic | Làm việc và giờ làm | overtime, full-time, part-time, workplace
topic | Choáng ngợp | overwhelm, overwhelming, astonishing
topic | Sở hữu | ownership, tenure, landlord, trustee
topic | Giấy và tập giấy | pad, notebook, textbook
topic | Hoảng sợ | panic, scare, terrify, terror
topic | Diễu hành và phô trương | parade, march, spectacle
topic | Cha mẹ và anh chị em | parental, sibling, ancestor
topic | Một phần | partial, partially, portion
topic | Pháp nhân hợp tác | partnership, corporation, merger
topic | Qua đời và tang lễ | passing, funeral, remains
topic | Đam mê | passionate, enthusiast, fond
topic | Thụ động và chủ động | passive, dynamic, initiate
topic | Bảo mật truy cập | password, identification
topic | Bản vá và sửa lỗi | patch, correction, flaw
topic | Lối đi và đường mòn | pathway, trail, lane
topic | Kiên nhẫn và bền bỉ | patience, persist, persistent, endure
topic | Khách quen và người bảo trợ | patron, sponsorship, subscriber
topic | Tạm dừng | pause, suspend, suspension, halt
meaning | Đỉnh | peak, summit, top
topic | Người ngang hàng và đồng đội | peer, mate, companion
topic | Hưu trí | pension, retirement
topic | Dược học và thuốc | pharmacy, pharmaceutical, pill, prescription
topic | Triết học | philosopher, methodology, theoretical
topic | Khai phá và tiên phong | pioneer, innovative, expedition
topic | Đường ống và bơm | pipeline, pump, drain
topic | Cướp và hải tặc | pirate, rob, robbery, theft
topic | Sắp đặt, bố trí | placement, setup, layout, deployment
topic | Cam kết và lời thề | pledge, vow, undertake, assurance
topic | Điện và đầu cắm | plug, circuit, hardware
topic | Cột và trụ | pole, timber, beam
topic | Ao và nước | pond, canal, tide
topic | Hoãn và tạm ngừng | postpone, pause, suspend
topic | Trước và sau | precede, subsequent, prior, latter
meaning | Quý giá, đáng giá | precious, treasure, worthwhile, worthy
topic | Săn mồi | predator, prey, trap
contrast | Tiền nhiệm và kế nhiệm | predecessor / successor
topic | Ưa thích và ưu tiên | preference, prioritize, prior
topic | Định kiến và kỳ thị | prejudice, stereotype, discrimination
topic | Sơ bộ và tiền đề | preliminary, premise, hypothesis
family | Kê đơn | prescribe, prescription
topic | Chủ trì và nhiệm kỳ | preside, presidency, presidential, tenure
meaning | Có lẽ, có khả năng | presumably, probable, potentially
topic | Ngăn ngừa và phòng tránh | prevention, inhibit, forbid
topic | Xem trước | preview, screening, footage
topic | Tự hào và phẩm giá | pride, dignity, glorious
topic | Đặc quyền và quyền lợi | privilege, franchise, ownership
topic | Tiếp tục | proceed, resume, ongoing
family | Truy tố | prosecute, prosecution, prosecutor
topic | Xử lý dữ liệu | processing, processor, input, output
topic | Năng suất | productive, productivity, efficiency
topic | Lợi nhuận | profitable, proceeds, earnings, yield
topic | Sâu sắc và kỹ lưỡng | profound, thoughtful, thorough, thoroughly
topic | Cấp tiến và cải cách | progressive, radical, reform
topic | Thăng chức | promotion, elevate, upgrade
topic | Quảng bá | promotion, publicity, propaganda
topic | Kiến nghị và đề xuất | proposition, petition, resolution
topic | Bảo vệ | protective, defender, safeguard
topic | Giao thức và kết nối | protocol, interface, connectivity
family | Tỉnh và địa phương | province, provincial
topic | Cung cấp và trang bị | provision, render, equip
meaning | Kích động, khơi gợi | provoke, stimulate, prompt, induce, tempt
topic | Tâm lý và cảm nhận | psychological, perception, consciousness
topic | Xuất bản | publishing, editorial, revision, literary
topic | Côn đồ và hung ác | punk, villain, vicious
topic | Tìm kiếm | quest, pursuit, seeker, trace
topic | Câu hỏi và khảo sát | query, questionnaire, poll
topic | Hạn ngạch và phân bổ | quota, allocation, portion
family | Chủng tộc và phân biệt chủng tộc | racial, racism, racist
topic | Đột kích | raid, invade, patrol
topic | Đường sắt | rail, terminal, transit
topic | Trấn an và nhẹ nhõm | reassure, assure, relieve
topic | Xây dựng lại | rebuild, reconstruction, restoration
meaning | Người nhận | receiver, recipient
topic | Sự công nhận | recognition, endorsement, glory
topic | Kể và ghi lại | recount, memoir, transcript
topic | Tuyển dụng | recruit, recruitment, rookie
topic | Trọng tài và thi đấu | referee, tournament, championship
topic | Lấy lại và thu hồi | regain, recovery, retrieve
topic | Chế độ chính trị | regime, republic, democracy
family | Quy định và điều tiết | regulate, regulator, regulatory
topic | Cai trị và chủ quyền | reign, governance, sovereignty
topic | Liên quan và tính áp dụng | relevance, applicable
contrast | Có và không liên quan | relevance / irrelevant
meaning | Chân thật, xác thực | authentic, genuine
meaning | Đầy đủ | adequate, sufficient
topic | Giảm nhẹ | relieve, relieved, mitigate
contrast | Miễn cưỡng và sẵn lòng | reluctant / willingness, voluntary
topic | Phần còn lại | remainder, remains, debris
topic | Phục hồi | renew, restore, restoration, recovery, revival, revive
topic | Báo cáo và tin đồn | reportedly, reporting, rumor, supposedly
topic | Cư dân và nơi ở | inhabitant, reside, residence, residential, settler
family | Từ chức | resign, resignation
topic | Sức chống chịu | resilience, resistance, robust, endure
topic | Rút lui | retreat, withdraw, withdrawal
topic | Đảo ngược và đối lập | reverse, contrary, overturn
meaning | Đáng cười, kỳ quặc | ridiculous, absurd, bizarre
topic | Xé, cắt, rạch | rip, slash, strip (remove clothes/a layer)
topic | Cướp | rob, robbery, theft
topic | Mạnh mẽ và vững chắc | robust, sound, stability
topic | Đung đưa | rock, swing
topic | Lãng mạn | romance, intimate, sentiment
topic | Hoa và thực vật | rose, herb, weed
topic | Quay và xoay | rotate, rotation, spin, twist
meaning | Hủy hoại | ruin, shatter, smash, devastate
topic | Phán quyết | ruling, verdict, conviction
topic | Tin đồn và tuyên bố chưa chắc | rumor, supposedly, allegedly
topic | Tôn giáo và thế tục | sacred, secular, ritual
topic | Tiếng nói và phát ngôn | say, vocal, spokesman, spokesperson, spokeswoman
topic | Bê bối và gian lận | scandal, fraud, corruption
meaning | Rải rác, biệt lập | scattered, isolated
topic | Kịch bản và phim | scenario, filmmaker, footage
topic | Học thuật và học bổng | scholar, scholarship, thesis
topic | Cào và xước | scratch, rip, flaw
topic | Xem xét kỹ | scrutiny, inspection, gaze
topic | Niêm phong và dấu | seal, signature
topic | Có vẻ như | seemingly, reportedly, so-called
meaning | Phần, đoạn | segment, portion, fragment, strip (long narrow piece)
topic | Cảm giác và độ nhạy | sensation, sensitivity, sensor
topic | Tách biệt | separation, isolate, isolation
topic | Định cư | settlement, settler, immigration
topic | Hấp dẫn và gợi cảm | sexy, appealing, charm
topic | Tạo hình | shaped, carve, craft
topic | Tổn hại và chấn thương | shatter, trauma, damaging
topic | Vận tải biển | shipping, cargo, marine
meaning | Sớm, sắp tới | shortly, presently, upcoming
topic | Thở và âm thanh nhẹ | sigh, whisper, intake
topic | Mô phỏng | simulation, reproduce, imagery
topic | Nô lệ và đàn áp | slavery, suppress, custody
topic | Một mình | sole, solely, solo, isolated
topic | Bằng cách nào đó | somehow, whereby
topic | Địa vị và chủ quyền | sovereignty, autonomy, kingdom
topic | Chuyên môn hóa | specialize, specialized, expertise
family | Quy định đặc tả | specification, specify
topic | Mẫu vật và thử nghiệm | specimen, experimental, testing
family | Cảnh ngoạn mục | spectacle, spectacular, spectator
topic | Suy đoán | speculate, speculation, assumption
topic | Hình cầu | sphere, globe
topic | Tràn và đổ ra | spill, shed, drain
topic | Cột sống và xương | spine, skull, limb
topic | Nuông chiều | spoil, indulge, fond
family | Người phát ngôn | spokesman, spokesperson, spokeswoman
topic | Tài trợ | sponsorship, patron, fundraising
topic | Ánh đèn và sự chú ý | spotlight, high-profile, publicity
topic | Phun và tiêm | spray, inject, injection
topic | Đội và đơn vị quân sự | squad, troop, militia, commander
topic | Ổn định | stability, stabilize, steadily
topic | Khởi nghiệp | start-up, entrepreneur, enterprise
topic | Thống kê và xác suất | statistical, probability, incidence
topic | Kích thích | stimulate, stimulus, trigger
topic | Khuấy và pha trộn | stir, blend, compound
topic | Căng thẳng và lo âu | strain, anxiety, distress
topic | Chiến lược và chiến thuật | strategic, tactic, tactical
topic | Tế bào và mô | streaming, tissue, biological
topic | Nghiêm ngặt và siết chặt | strictly, tighten, restrict
topic | Đột quỵ và sức khỏe | stroke, trauma, healthcare
topic | Vấp và chuyển động không vững | stumble, crawl, drift
topic | Đầu hàng và phục tùng | submission, surrender, yield, compliance
family | Đăng ký định kỳ | subscribe, subscriber, subscription
topic | Ngoại ô | suburb, suburban, municipal
topic | Người kế nhiệm và thay thế | successor, replacement, substitute
topic | Đau khổ và bi kịch | suffering, misery, tragedy, tragic
topic | Tự sát và tử vong | suicide, passing, fatal
topic | Tuyệt vời và xuất sắc | super, superb, terrific, outstanding
topic | Người quản lý | superintendent, supervisor, administrator
topic | Giám sát | supervise, supervision, supervisor, surveillance
topic | Phẫu thuật | surgeon, surgical, physician
topic | Vượt trội | surpass, superior, top, outstanding
family | Sống sót | survival, survivor
topic | Tạm đình chỉ | suspend, suspension, pause
topic | Nghi ngờ | suspicion, suspicious, skeptical, uncertainty
topic | Thẻ và nhãn | tag, caption, identification
topic | Gõ và đánh nhẹ | tap, slap, punch
topic | Xăm và trang trí cơ thể | tattoo, makeup, shaped
topic | Công nghệ và phần cứng | technological, hardware, electronics
topic | Ngưỡng và đầu cuối | threshold, terminal, boundary
topic | Điều khoản | terms, provision, specification
topic | Địa hình và lãnh thổ | terrain, territory, coastal
meaning | Rất, hết sức | terribly, greatly, utterly
family | Khủng bố | terror, terrorism, terrorist
topic | Làm chứng và chứng cứ | testify, testimony, verify
topic | Kết cấu và chất liệu | texture, fabric, structural
topic | Mốc thời gian | timeline, timing, timely, deadline
topic | Khoan dung và chịu đựng | tolerance, tolerate, endure
topic | Cảm động và hào hứng | moving, thrilled, delighted
topic | Gỗ và xây dựng | timber, beam, carve
topic | Thuốc lá và nghiện | tobacco, addiction, consumption
topic | Ném và tung | toss, plunge, slam
topic | Tính tổng | total, calculation, gross
topic | Vận chuyển đường bộ | trailer, pickup, transit
topic | Bi kịch | tragedy, tragic, disastrous
topic | Bản sao và tái tạo | transcript, reproduce, reconstruction
topic | Biến đổi | transformation, conversion, variation
topic | Truyền dẫn | transmission, transmit, convey
topic | Trong suốt và minh bạch | transparency, transparent, clarity
topic | Điều ước và ngoại giao | treaty, convention, diplomatic
family | Bộ lạc | tribal, tribe
topic | Số lượng và nhóm | trillion, trio, fraction
topic | Chiến thắng và giải thưởng | triumph, trophy, medal
topic | Dâng nạp và cúng tế | tribute, offering, sacrifice
topic | Học phí và học bổng | tuition, scholarship
topic | Khối u và bệnh | tumor, diagnosis, clinical
topic | Tham dự và bỏ phiếu | turnout, attendance, voting
topic | Tối thượng và đỉnh cao | ultimate, summit, superior
contrast | Chấp nhận và không chấp nhận | unacceptable, acceptance
topic | Trải qua và chịu đựng | undergo, endure, sustain
meaning | Làm suy yếu | undermine, weaken
meaning | Đoàn kết, thống nhất | unify, unite, unity, solidarity
topic | Sử dụng và hữu dụng | usage, utilize, utility, useless
family | Tiêm chủng | vaccinate, vaccination
contrast | Rõ ràng và mơ hồ | vague / explicit, clarity
topic | Biến mất và mờ đi | vanish, fade, invisible
family | Biến thiên | variable, variation, varied
topic | Ăn chay và dinh dưỡng | vegan, nutrition, dairy
topic | Rủi ro và mạo hiểm | venture, risky, hazard
topic | Lời nói và âm lượng | verbal, oral, vocal, whisper, yell
topic | Thơ ca và lời bài hát | verse, lyric, literary
topic | Cựu binh và chiến binh | veteran, warrior, troop
topic | Khả thi và khả dụng | viable, functional, applicable
contrast | Thói xấu và đức tính | vice, virtue
topic | Tàn ác và phản diện | villain, vicious, brutal
meaning | Quan điểm | viewpoint, stance, outlook, sentiment
topic | Giấy phép đi lại | visa, identification
contrast | Nhìn thấy và không nhìn thấy | visible / invisible, hidden
family | Dễ bị tổn thương | vulnerability, vulnerable
topic | Phường và chính quyền địa phương | ward, municipal, civic
topic | Kho và tồn kho | warehouse, inventory, storage
topic | Chiến tranh và chiến binh | warfare, warrior, battlefield, veteran
topic | Bảo đảm và cho phép | warrant, authorize, assurance
topic | Dệt và sợi | weave, fiber, fabric, thread
topic | Cây và cỏ | weed, herb, wheat
topic | Giếng và nước | well, pump, drain
topic | Nhấn mạnh và phủ định | whatsoever, literally, sheer
topic | Đánh bằng roi | whip, slap, assault
topic | Mở rộng và chiều rộng | widen, width, expansion
topic | Lực lượng và nơi làm việc | workforce, workplace, personnel, occupation
topic | Xưởng và sản xuất | workshop, manufacture, manufacturing
topic | Đáng công và xứng đáng | worthwhile, worthy, merit
topic | Sản lượng và mùa gặt | yield, harvest, productivity
topic | Hành vi và tâm lý | behavioral, psychological, cognitive
contrast | Phản bội và trung thành | betray / loyal, loyalty
topic | Ra quyết định | decision-making, decisive, determination
meaning | Theo sau | ensue, subsequent, subsequently
topic | Hết hạn và hiệu lực | expire, valid, deadline
family | Khai thác và lợi dụng | exploit, exploitation
topic | Khai thác nguồn lực | exploit, utilize, mining
topic | Phe phái chính trị | faction, coalition, alliance
contrast | Thông minh và ngốc nghếch | fool / genius, wisdom
topic | Phấn khởi và vui vẻ | gay, cheer, delighted
topic | Trục và truyền động | hub, gear, mechanical
topic | Khuynh hướng | inclined, tendency, preference
topic | Gây ra và gánh chịu | inflict, incur, aftermath
topic | Bất đẳng thức và phương trình | inequality, equation, mathematical
family | Tất yếu | inevitable, inevitably
topic | Ảnh hưởng và thế lực | influential, dominance, prominent
topic | Thông tin và ghi chép | info, documentation, input
topic | Hạ tầng và hệ thống | infrastructure, framework, grid
topic | Thuộc tính vốn có | inherent, trait, attribute
topic | Mực và viết | ink, signature, transcript
topic | Bãi cỏ và thực vật | lawn, weed, wheat
topic | Khoảng thời gian xen giữa | meantime, interval, interim
topic | Động vật nhỏ | rat, bat, worm
topic | Vị trí tương đối | rear, beneath, adjacent
topic | Hợp lý | rational, reasonably, reasoning
topic | Hồ sơ xin việc | résumé, recruitment, applicant
topic | Thứ tự và trình tự | secondly, respectively, consecutive
topic | Chồi và cây | shoot, stem, herb
topic | Vị trí và bố trí | situated, placement, layout
topic | Trêu chọc và xúc phạm | tease, insult, harassment
topic | Buôn bán bất hợp pháp | trafficking, dealer, offender
topic | Học viện và nhà giáo | academy, educator, faculty
family | Mỉa mai và trớ trêu | irony, ironically
topic | Hành vi thô bạo | roughly, brutal, harsh
family | Cáo buộc và người bị buộc tội (allegation) | allegation, allege, allegedly
family | Kích hoạt (activate) | activate, activation
family | Phân bổ (allocate) | allocate, allocation
family | Vi phạm (violate) | violate, violation
family | Chuyên môn và năng lực (competence) | competence, competent
family | Phân loại (classification) | classification, classify
family | Độ tin cậy (credibility) | credibility, credible
family | Tò mò (curiosity) | curiosity, curious
family | Cống hiến (dedicated) | dedicated, dedication
family | Đi xuống (descend) | descend, descent
family | Phá hủy (destruction) | destruction, destructive
family | Phá hủy (devastate) | devastate, devastating
family | Khác biệt (differ) | differ, differentiate
family | Khác biệt (distinct) | distinct, distinction, distinguish
family | Thất vọng (disappoint) | disappoint, disappointment
family | Thất vọng (frustrated) | frustrated, frustrating, frustration
family | Tiết lộ (disclose) | disclose, disclosure
family | Vứt bỏ và xử lý (disposal) | disposal, dispose
family | Đa dạng (diverse) | diverse, diversity
family | Đa dạng (varied) | varied, variation
family | Chi phối và ưu thế (dominance) | dominance, dominant
family | Lỗi và khiếm khuyết (flaw) | flaw, flawed
family | Chân thật (genuine) | genuine, genuinely
family | Tăng cường độ (intensify) | intensify, intensity, intensive
family | Hy vọng (hopeful) | hopeful, hopefully
family | Hy vọng (optimism) | optimism, optimistic
family | Can thiệp (interfere) | interfere, interference
family | Can thiệp (intervene) | intervene, intervention
family | Sản xuất, chế tạo (manufacture) | manufacture, manufacturing
family | Điều hướng (navigate) | navigate, navigation
family | Ám ảnh (obsess) | obsess, obsession
family | Choáng ngợp (overwhelm) | overwhelm, overwhelming
family | Một phần (partial) | partial, partially
family | Xử lý dữ liệu (processing) | processing, processor
family | Năng suất (productive) | productive, productivity
family | Tuyển dụng (recruit) | recruit, recruitment
family | Giảm nhẹ (relieve) | relieve, relieved
family | Cướp (rob) | rob, robbery
family | Quay và xoay (rotate) | rotate, rotation
family | Tách biệt (isolate) | isolate, isolation
family | Chuyên môn hóa (specialize) | specialize, specialized
family | Ổn định (stability) | stability, stabilize
family | Kích thích (stimulate) | stimulate, stimulus
family | Chiến lược và chiến thuật (tactic) | tactic, tactical
family | Ngoại ô (suburb) | suburb, suburban
family | Giám sát (supervise) | supervise, supervision, supervisor
family | Tạm đình chỉ (suspend) | suspend, suspension
family | Nghi ngờ (suspicion) | suspicion, suspicious
family | Khoan dung và chịu đựng (tolerance) | tolerance, tolerate
family | Truyền dẫn (transmission) | transmission, transmit
family | Trong suốt và minh bạch (transparency) | transparency, transparent
family | Hợp lý (reasonably) | reasonably, reasoning
`;

export const priorityRelationGroups = source
    .trim()
    .split('\n')
    .map((line, index) => {
        const [kind, label, terms] = line.split(' | ');
        const sides =
            kind === 'contrast'
                ? terms.includes(' / ')
                    ? terms.split(' / ').map((side) => side.split(', '))
                    : terms.split(', ').map((term) => [term])
                : undefined;
        return {
            id: `study-${index + 1}`,
            kind,
            label,
            members: sides ? sides.flat() : terms.split(', ').map((term) => term.trim()),
            ...(sides ? { sides } : {}),
        };
    });

export const relationSelector = (word) =>
    word.term + (word.qualifier ? ` (${word.qualifier})` : '');

// These cards were reviewed too. No other supplied card expresses the same
// function closely enough to justify a useful direct learning link.
export const priorityRelationStandalone = [
    {
        member: 'sometime',
        reason: 'Chỉ một thời điểm không xác định; không đồng nghĩa với occasional (thỉnh thoảng).',
    },
    {
        member: 'whoever',
        reason: 'Đại từ chỉ bất kỳ ai; danh sách không có đại từ tương ứng đủ gần để ghép nhóm.',
    },
];
